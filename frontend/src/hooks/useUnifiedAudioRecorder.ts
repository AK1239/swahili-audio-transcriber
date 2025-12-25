/** Unified hook for recording audio from microphone or browser tab */
import { useCallback, useMemo } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { useTabAudioRecorder } from './useTabAudioRecorder';

export type RecordingMode = 'microphone' | 'tab';

interface UseUnifiedAudioRecorderOptions {
  /** Recording mode: 'microphone' for mic input, 'tab' for tab audio */
  mode: RecordingMode;
  /** Optional max recording duration in seconds */
  maxDurationSeconds?: number;
}

/**
 * Unified audio recorder hook that supports both microphone and tab audio recording.
 * 
 * This hook abstracts the differences between microphone and tab audio recording,
 * providing a consistent API regardless of the recording source.
 */
export function useUnifiedAudioRecorder(options: UseUnifiedAudioRecorderOptions) {
  const { mode, maxDurationSeconds } = options;

  // Use the appropriate recorder based on mode
  const micRecorder = useAudioRecorder({ maxDurationSeconds });
  const tabRecorder = useTabAudioRecorder({ maxDurationSeconds });

  // Select the active recorder based on mode
  const activeRecorder = useMemo(() => {
    return mode === 'microphone' ? micRecorder : tabRecorder;
  }, [mode, micRecorder, tabRecorder]);

  // Reset both recorders when mode changes
  const reset = useCallback(() => {
    micRecorder.reset();
    tabRecorder.reset();
  }, [micRecorder, tabRecorder]);

  return {
    /** Current recorder status */
    status: activeRecorder.status,
    /** Whether the recorder is currently recording */
    isRecording: activeRecorder.isRecording,
    /** Total recording duration in seconds */
    durationSeconds: activeRecorder.durationSeconds,
    /** Recorded audio as a File (available after stopping) */
    audioFile: activeRecorder.audioFile,
    /** Optional error message */
    error: activeRecorder.error,
    /** Start a new recording */
    startRecording: activeRecorder.startRecording,
    /** Stop the current recording */
    stopRecording: activeRecorder.stopRecording,
    /** Reset recorder state and discard any recording */
    reset,
    /** Convenience flag: whether a recording is available */
    hasRecording: activeRecorder.hasRecording,
    /** Current recording mode */
    mode,
  };
}

