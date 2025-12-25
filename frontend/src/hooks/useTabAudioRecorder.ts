/** Hook for recording audio from a browser tab (e.g., Google Meet) */
import { useCallback, useEffect, useRef, useState } from 'react';

type RecorderStatus = 'idle' | 'recording' | 'stopped';

interface UseTabAudioRecorderOptions {
  /** Optional max recording duration in seconds */
  maxDurationSeconds?: number;
}

export function useTabAudioRecorder(options: UseTabAudioRecorderOptions = {}) {
  const { maxDurationSeconds } = options;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const statusRef = useRef<RecorderStatus>('idle');

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

    // Stop all tracks from the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    chunksRef.current = [];
    statusRef.current = 'idle';
    setStatus('idle');
    setDurationSeconds(0);
    setAudioFile(null);
    setError(null);
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioFile(null);

      // Request tab audio access using getDisplayMedia
      // NOTE: Chrome requires video: true even if we only want audio
      // We'll extract only audio tracks after getting the stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: 1, // Minimal video settings (we won't use video)
          width: 1,
          height: 1,
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 44100,
        },
      });

      // Extract only audio tracks (ignore video track)
      const audioTracks = stream.getAudioTracks();
      
      if (audioTracks.length === 0) {
        // User didn't enable "Share tab audio" or no audio available
        stream.getTracks().forEach((track) => track.stop());
        throw new Error('Hakuna sauti iliyopatikana. Hakikisha umechagua "Share tab audio" wakati wa kuchagua tab.');
      }

      // Create audio-only stream for recording
      const audioOnlyStream = new MediaStream(audioTracks);

      // Store original stream reference for cleanup (need to stop all tracks)
      streamRef.current = stream;

      // Handle stream ending (e.g., user stops sharing)
      stream.getTracks().forEach((track) => {
        track.onended = () => {
          if (statusRef.current === 'recording' && mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
          }
        };
      });

      // Stop video track immediately (we don't need it)
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => track.stop());

      const mimeType =
        typeof MediaRecorder !== 'undefined' &&
        MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm';

      // Use audio-only stream for MediaRecorder
      const mediaRecorder = new MediaRecorder(audioOnlyStream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const filename = `tab-recording-${new Date()
          .toISOString()
          .replace(/[:.]/g, '-')}.webm`;
        const file = new File([blob], filename, { type: 'audio/webm' });
        setAudioFile(file);
        statusRef.current = 'stopped';
        setStatus('stopped');
        cleanup();
      };

      mediaRecorder.start();
      statusRef.current = 'recording';
      setStatus('recording');
      setDurationSeconds(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setDurationSeconds((prev) => {
          const next = prev + 1;
          if (maxDurationSeconds && next >= maxDurationSeconds) {
            // Auto-stop when reaching max duration
            if (mediaRecorderRef.current && statusRef.current === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error('Tab audio recording error:', err);
      
      let errorMessage = 'Imeshindikana kupata ufikiaji wa sauti ya tab.';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.message.includes('NotAllowedError')) {
          errorMessage = 'Umeghairi ufikiaji. Tafadhali jaribu tena na ruhusu ufikiaji wa skrini.';
        } else if (err.name === 'NotSupportedError' || err.message.includes('NotSupportedError')) {
          errorMessage = 'Kichupo hiki hakina uwezo wa kurekodi sauti ya tab. Tumia Chrome au Edge.';
        } else if (err.message.includes('Hakuna sauti')) {
          errorMessage = err.message;
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      reset();
    }
  }, [cleanup, maxDurationSeconds, reset]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && statusRef.current === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

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
    /** Start a new recording (will request tab audio access) */
    startRecording,
    /** Stop the current recording */
    stopRecording,
    /** Reset recorder state and discard any recording */
    reset,
    /** Convenience flag: whether a recording is available */
    hasRecording: !!audioFile,
  };
}

