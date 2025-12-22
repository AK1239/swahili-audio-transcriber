/** File upload component */
import React, { useCallback, useState } from 'react';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { formatFileSize } from '../../../utils/fileValidation';

interface FileUploadProps {
  onUploadSuccess?: (transcription: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const { uploadFile, uploading, error, transcription } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);
  
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);
  
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );
  
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    
    try {
      const result = await uploadFile(selectedFile);
      if (result && onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      // Error is handled by hook
    }
  }, [selectedFile, uploadFile, onUploadSuccess]);
  
  // Call onUploadSuccess when transcription is available
  React.useEffect(() => {
    if (transcription && onUploadSuccess) {
      onUploadSuccess(transcription);
    }
  }, [transcription, onUploadSuccess]);
  
  return (
    <Card title="Upload Audio File">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".mp3,.wav,.mp4"
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
          disabled={uploading}
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer block"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            MP3, WAV, or MP4 (max. 25MB)
          </p>
        </label>
      </div>
      
      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              onClick={handleUpload}
              loading={uploading}
              disabled={uploading}
            >
              Upload
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      {transcription && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            File uploaded successfully! Transcription ID: {transcription.id}
          </p>
        </div>
      )}
    </Card>
  );
};

