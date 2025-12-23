/** API endpoint constants */
export const endpoints = {
  upload: '/upload',
  transcript: (id: string) => `/transcript/${id}`,
  summary: (id: string) => `/summary/${id}`,
  audio: (id: string) => `/audio/${id}`,
} as const;

