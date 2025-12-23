/** File list component */
import React from 'react';
import { UploadedFile } from '../../../hooks/useFileUploadState';
import { FileItem } from './FileItem';
import { FileUploadingItem } from './FileUploadingItem';

interface FileListProps {
  files: UploadedFile[];
  onDeleteFile: (id: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onDeleteFile }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-[#4c599a] uppercase tracking-wider px-2">
        Ready to Transcribe
      </h3>

      {files.map((file) => {
        if (file.status === 'ready') {
          return (
            <FileItem key={file.id} file={file} onDelete={() => onDeleteFile(file.id)} />
          );
        }

        if (file.status === 'uploading') {
          return (
            <FileUploadingItem
              key={file.id}
              file={file}
              onCancel={() => onDeleteFile(file.id)}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

