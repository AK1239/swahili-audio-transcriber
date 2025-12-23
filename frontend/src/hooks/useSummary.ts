/** Custom hook for fetching summary */
import { useQuery } from 'react-query';
import { summaryService } from '../services/summaryService';
import { Summary } from '../types/summary';

export function useSummary(id: string | null) {
  return useQuery<Summary>(
    ['summary', id],
    async () => {
      const data = await summaryService.getSummary(id!);
      return data;
    },
    {
      enabled: !!id,
      retry: 2,
      onError: (error) => {
        console.error('Error fetching summary:', error);
      },
    },
  );
}

