/** API endpoint constants */
export const endpoints = {
  upload: '/upload',
  transcript: (id: string) => `/transcript/${id}`,
  summary: (id: string) => `/summary/${id}`,
} as const;

