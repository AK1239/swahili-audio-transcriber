/** Summary service */
import client from '../api/client';
import { endpoints } from '../api/endpoints';
import { Summary } from '../types/summary';

// Helper to convert snake_case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Helper to transform object keys from snake_case to camelCase
function transformKeys<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(transformKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    const transformed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = toCamelCase(key);
      transformed[camelKey] = transformKeys(value);
    }
    return transformed;
  }
  return obj;
}

export const summaryService = {
  /**
   * Get summary by transcription ID
   */
  async getSummary(id: string): Promise<Summary> {
    const response = await client.get<any>(endpoints.summary(id));
    const transformed = transformKeys(response.data);
    
    return {
      id: transformed.id,
      transcriptionId: transformed.transcriptionId || transformed.transcription_id,
      muhtasari: transformed.muhtasari || '',
      maamuzi: transformed.maamuzi || [],
      kazi: (transformed.kazi || []).map((item: any) => ({
        person: item.person || '',
        task: item.task || '',
        dueDate: item.dueDate || item.due_date,
      })),
      masualaYaliyoahirishwa: transformed.masualaYaliyoahirishwa || transformed.masuala_yaliyoahirishwa || [],
    };
  },
};

