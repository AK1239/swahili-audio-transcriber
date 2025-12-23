/** Hook for managing transcription settings */
import { useState, useCallback } from 'react';

export type Dialect = 'standard' | 'coast' | 'congo' | 'sheng';

export interface OutputOptions {
  fullTranscript: boolean;
  smartSummary: boolean;
}

export interface TranscriptionSettings {
  dialect: Dialect;
  outputOptions: OutputOptions;
}

export function useTranscriptionSettings(initialSettings?: Partial<TranscriptionSettings>) {
  const [dialect, setDialect] = useState<Dialect>(initialSettings?.dialect || 'standard');
  const [outputOptions, setOutputOptions] = useState<OutputOptions>(
    initialSettings?.outputOptions || {
      fullTranscript: true,
      smartSummary: true,
    }
  );

  const updateDialect = useCallback((newDialect: Dialect) => {
    setDialect(newDialect);
  }, []);

  const updateOutputOptions = useCallback((updates: Partial<OutputOptions>) => {
    setOutputOptions((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setDialect('standard');
    setOutputOptions({
      fullTranscript: true,
      smartSummary: true,
    });
  }, []);

  return {
    dialect,
    outputOptions,
    updateDialect,
    updateOutputOptions,
    resetSettings,
    settings: { dialect, outputOptions },
  };
}

