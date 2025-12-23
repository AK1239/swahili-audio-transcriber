/** API client setup */
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError, ApiException, NetworkError } from '../types/api';
import { config } from '../config/env';

const client: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 90000, // 90 seconds for long-running transcription/summarization requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server responded with error
      const apiError = error.response.data;
      throw new ApiException(
        apiError.detail || 'An error occurred',
        apiError.type,
      );
    } else if (error.request) {
      // Request made but no response
      throw new NetworkError('No response from server');
    } else {
      // Error setting up request
      throw new Error(error.message || 'An error occurred');
    }
  },
);

export default client;

