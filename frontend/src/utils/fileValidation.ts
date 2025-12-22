/** File validation utilities */
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from '../config/constants';

export interface FileValidationError {
  message: string;
}

export function validateFile(file: File): FileValidationError | null {
  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_FILE_TYPES.includes(extension as any)) {
    return {
      message: `File type not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
    };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const maxSizeMB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
    return {
      message: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }
  
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

