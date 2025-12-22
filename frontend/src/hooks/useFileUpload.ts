/** Custom hook for file upload */
import { useState } from 'react';
import { transcriptionService } from '../services/transcriptionService';
import { Transcription } from '../types/transcription';
import { validateFile } from '../utils/fileValidation';
import { ApiException } from '../types/api';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  
  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setTranscription(null);
    
    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError.message);
      }
      
      // Upload file
      const result = await transcriptionService.uploadFile(file);
      setTranscription(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiException 
        ? err.detail 
        : err instanceof Error 
        ? err.message 
        : 'An error occurred during upload';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };
  
  return { uploadFile, uploading, error, transcription };
}

