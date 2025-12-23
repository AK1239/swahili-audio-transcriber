/** Drag and drop zone component */
import React from 'react';
import { Button } from '../../ui/Button';

interface DragDropZoneProps {
  dragActive: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputId?: string;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  dragActive,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
  inputId = 'file-input',
}) => {
  return (
    <div
      className={`group relative flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed ${
        dragActive
          ? 'border-primary'
          : 'border-[#cfd3e7]'
      } hover:border-primary bg-white px-6 py-12 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        type="file"
        accept=".mp3,.wav,.m4a,.webm,.ogg"
        onChange={onFileInput}
        className="hidden"
        id={inputId}
      />
      <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center gap-2 text-center">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-4xl">cloud_upload</span>
        </div>
        <p className="text-[#0d101b] text-lg font-bold leading-tight">
          Buruta faili hapa (Drag file here)
        </p>
        <p className="text-[#4c599a] text-sm font-normal">
          Supports MP3, WAV, M4A, WEBM, OGG (Max 25MB) 
        </p>
      </label>
      <Button
        variant="default"
        className="flex items-center justify-center rounded-xl h-10 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-blue-700 transition-colors"
        onClick={() => document.getElementById(inputId)?.click()}
      >
        Browse Files
      </Button>
    </div>
  );
};

