/** Hook for managing file upload state */
import { useState, useCallback } from 'react';
import { Transcription } from '../types/transcription';

export interface UploadedFile {
  id: string;
  file: File;
  status: 'ready' | 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
  transcription?: Transcription;
  error?: string;
}

export function useFileUploadState() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const addFile = useCallback((file: File) => {
    const newFile: UploadedFile = {
      id: `${Date.now()}-${Math.random()}`,
      file,
      status: 'ready',
    };
    setUploadedFiles((prev) => [...prev, newFile]);
    return newFile.id;
  }, []);

  const updateFile = useCallback((id: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const getReadyFiles = useCallback(() => {
    return uploadedFiles.filter((f) => f.status === 'ready');
  }, [uploadedFiles]);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    uploadedFiles,
    addFile,
    updateFile,
    removeFile,
    getReadyFiles,
    clearFiles,
  };
}

