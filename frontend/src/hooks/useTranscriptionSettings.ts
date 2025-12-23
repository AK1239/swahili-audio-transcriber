/** Hook for managing transcription settings */
import { useState, useCallback } from 'react';

export interface OutputOptions {
  fullTranscript: boolean;
  smartSummary: boolean;
}

export interface TranscriptionSettings {
  outputOptions: OutputOptions;
}

export function useTranscriptionSettings(initialSettings?: Partial<TranscriptionSettings>) {
  const [outputOptions, setOutputOptions] = useState<OutputOptions>(
    initialSettings?.outputOptions || {
      fullTranscript: true,
      smartSummary: true,
    }
  );

  const updateOutputOptions = useCallback((updates: Partial<OutputOptions>) => {
    setOutputOptions((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setOutputOptions({
      fullTranscript: true,
      smartSummary: true,
    });
  }, []);

  return {
    outputOptions,
    updateOutputOptions,
    resetSettings,
    settings: { outputOptions },
  };
}

