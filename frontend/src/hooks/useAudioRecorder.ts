/** Hook for recording audio from the user's microphone */
import { useCallback, useEffect, useRef, useState } from 'react';

type RecorderStatus = 'idle' | 'recording' | 'stopped';

interface UseAudioRecorderOptions {
  /** Optional max recording duration in seconds */
  maxDurationSeconds?: number;
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const { maxDurationSeconds } = options;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clear timers and tracks
  const cleanup = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current) {
      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    chunksRef.current = [];
    setStatus('idle');
    setDurationSeconds(0);
    setAudioFile(null);
    setError(null);
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioFile(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mimeType =
        typeof MediaRecorder !== 'undefined' &&
        MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const filename = `recording-${new Date()
          .toISOString()
          .replace(/[:.]/g, '-')}.webm`;
        const file = new File([blob], filename, { type: 'audio/webm' });
        setAudioFile(file);
        setStatus('stopped');
        cleanup();
      };

      mediaRecorder.start();
      setStatus('recording');
      setDurationSeconds(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setDurationSeconds((prev) => {
          const next = prev + 1;
          if (maxDurationSeconds && next >= maxDurationSeconds) {
            // Auto-stop when reaching max duration
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Imeshindikana kupata ufikiaji wa kipaza sauti (microphone).',
      );
      reset();
    }
  }, [cleanup, maxDurationSeconds, reset]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    /** Current recorder status */
    status,
    /** Whether the recorder is currently recording */
    isRecording: status === 'recording',
    /** Total recording duration in seconds */
    durationSeconds,
    /** Recorded audio as a File (available after stopping) */
    audioFile,
    /** Optional error message */
    error,
    /** Start a new recording (will request microphone access) */
    startRecording,
    /** Stop the current recording */
    stopRecording,
    /** Reset recorder state and discard any recording */
    reset,
    /** Convenience flag: whether a recording is available */
    hasRecording: !!audioFile,
  };
}


