/** File item component for uploading state */
import React from 'react';
import { UploadedFile } from '../../../hooks/useFileUploadState';

interface FileUploadingItemProps {
  file: UploadedFile;
  onCancel: () => void;
}

export const FileUploadingItem: React.FC<FileUploadingItemProps> = ({ file, onCancel }) => {
  return (
    <div className="rounded-xl bg-white border border-[#e7e9f3] p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-4 relative z-0">
        <div className="bg-gray-100 rounded-lg size-12 shrink-0 flex items-center justify-center text-gray-500">
          <span className="material-symbols-outlined text-2xl">mic</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[#0d101b] text-base font-bold truncate">
              {file.file.name}
            </p>
            <span className="text-sm font-bold text-primary">
              Inapakiwa... {file.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-[#e7e9f3] rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full animate-pulse transition-all duration-300"
              style={{ width: `${file.progress || 0}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-[#4c599a] hover:text-red-500 transition-colors p-2"
          aria-label="Cancel upload"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

