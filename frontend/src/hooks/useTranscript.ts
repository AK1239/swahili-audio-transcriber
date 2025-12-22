/** Custom hook for fetching transcript */
import { useQuery } from 'react-query';
import { transcriptionService } from '../services/transcriptionService';
import { Transcription } from '../types/transcription';

export function useTranscript(id: string | null) {
  return useQuery<Transcription>(
    ['transcript', id],
    () => transcriptionService.getTranscript(id!),
    {
      enabled: !!id,
      retry: 2,
      refetchInterval: (data) => {
        // Poll if still processing
        return data?.status === 'processing' ? 2000 : false;
      },
    },
  );
}

