/** Summary service */
import client from '../api/client';
import { endpoints } from '../api/endpoints';
import { Summary } from '../types/summary';

export const summaryService = {
  /**
   * Get summary by transcription ID
   */
  async getSummary(id: string): Promise<Summary> {
    const response = await client.get<Summary>(endpoints.summary(id));
    return response.data;
  },
};

