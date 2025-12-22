/** Transcription service */
import client from '../api/client';
import { endpoints } from '../api/endpoints';
import { Transcription } from '../types/transcription';

export const transcriptionService = {
  /**
   * Upload audio file for transcription
   */
  async uploadFile(file: File): Promise<Transcription> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await client.post<Transcription>(
      endpoints.upload,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    
    return response.data;
  },
  
  /**
   * Get transcript by ID
   */
  async getTranscript(id: string): Promise<Transcription> {
    const response = await client.get<Transcription>(endpoints.transcript(id));
    return response.data;
  },
};

