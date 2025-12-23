/** File item component for ready state */
import React from 'react';
import { formatFileSize } from '../../../utils/fileValidation';
import { UploadedFile } from '../../../hooks/useFileUploadState';

interface FileItemProps {
  file: UploadedFile;
  onDelete: () => void;
}

export const FileItem: React.FC<FileItemProps> = ({ file, onDelete }) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white border border-[#e7e9f3] p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 rounded-lg size-12 shrink-0 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl">audio_file</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#0d101b] text-base font-bold truncate">
            {file.file.name}
          </p>
          <div className="flex items-center gap-2 text-[#4c599a] text-sm">
            <span>{formatFileSize(file.file.size)}</span>
            <span className="size-1 rounded-full bg-[#cfd3e7]"></span>
            <span className="text-green-600 font-medium">Tayari (Ready)</span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-[#4c599a] hover:text-red-500 transition-colors p-2"
          aria-label="Delete file"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
      {/* Fake Waveform */}
      <div className="w-full h-12 flex items-end gap-[2px] opacity-70 mt-2 px-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-1 bg-primary rounded-full"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

