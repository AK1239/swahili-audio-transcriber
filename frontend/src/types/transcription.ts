/** Transcription types */
export type ProcessingStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed';

export interface Transcription {
  id: string;
  filename: string;
  status: ProcessingStatus;
  transcriptText?: string;
  createdAt: string;
  updatedAt: string;
}

