/** Custom hook for fetching summary */
import { useQuery } from 'react-query';
import { summaryService } from '../services/summaryService';
import { Summary } from '../types/summary';

export function useSummary(id: string | null) {
  return useQuery<Summary>(
    ['summary', id],
    () => summaryService.getSummary(id!),
    {
      enabled: !!id,
      retry: 2,
    },
  );
}

