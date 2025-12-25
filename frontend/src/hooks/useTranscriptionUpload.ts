/** Hook for handling transcription upload logic */
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFileUpload } from './useFileUpload';
import { UploadedFile } from './useFileUploadState';

interface UseTranscriptionUploadProps {
  updateFile: (id: string, updates: Partial<UploadedFile>) => void;
}

export function useTranscriptionUpload({ updateFile }: UseTranscriptionUploadProps) {
  const navigate = useNavigate();
  const { uploadFile, uploading, error } = useFileUpload();

  const uploadFiles = useCallback(
    async (files: UploadedFile[]) => {
      const readyFiles = files.filter((f) => f.status === 'ready');

      for (const uploadedFile of readyFiles) {
        // Update status to uploading
        updateFile(uploadedFile.id, { status: 'uploading', progress: 0 });

        try {
          // Simulate progress
          let currentProgress = 0;
          const progressInterval = setInterval(() => {
            currentProgress += 10;
            if (currentProgress < 90) {
              updateFile(uploadedFile.id, { progress: currentProgress });
            } else {
              clearInterval(progressInterval);
            }
          }, 200);

          const result = await uploadFile(
            uploadedFile.file,
            uploadedFile.origin ?? 'file-upload',
          );

          clearInterval(progressInterval);

          // Update status to completed
          updateFile(uploadedFile.id, {
            status: 'completed',
            progress: 100,
            transcription: result,
          });

          // Navigate to transcript view after successful upload
          if (result) {
            setTimeout(() => {
              navigate(`/transcript/${result.id}`);
            }, 1000);
          }
        } catch (err) {
          // Update status to error
          updateFile(uploadedFile.id, {
            status: 'error',
            progress: 0,
            error: err instanceof Error ? err.message : 'Upload failed',
          });
        }
      }
    },
    [uploadFile, updateFile, navigate]
  );

  return {
    uploadFiles,
    uploading,
    error,
  };
}

