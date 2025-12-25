/** Upload page component */
import { useState, useCallback } from 'react';
import { useFileUploadState } from '../../hooks/useFileUploadState';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useTranscriptionSettings } from '../../hooks/useTranscriptionSettings';
import { useTranscriptionUpload } from '../../hooks/useTranscriptionUpload';
import { DragDropZone } from '../features/upload/DragDropZone';
import { FileList } from '../features/upload/FileList';
import { SettingsPanel } from '../features/upload/SettingsPanel';
import { RecordPanel } from '../features/upload/RecordPanel';
import { Toast } from '../ui/Toast';

export function UploadPage() {
  const [showToast, setShowToast] = useState(false);
  
  // File management
  const {
    uploadedFiles,
    addFile,
    updateFile,
    removeFile,
    getReadyFiles,
  } = useFileUploadState();

  // Drag and drop
  const handleFileSelect = useCallback(
    (file: File) => {
      addFile(file, 'file-upload');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    [addFile]
  );

  const dragAndDrop = useDragAndDrop(handleFileSelect);

  // Settings
  const {
    settings,
    updateOutputOptions,
  } = useTranscriptionSettings();

  // Upload logic
  const { uploadFiles, uploading, error } = useTranscriptionUpload({
    updateFile,
  });

  const handleStartTranscription = useCallback(async () => {
    await uploadFiles(uploadedFiles);
  }, [uploadFiles, uploadedFiles]);

  const hasReadyFiles = getReadyFiles().length > 0;

  return (
    <div className="layout-content-container flex flex-col max-w-5xl w-full flex-1 gap-8">
      {/* Page Heading */}
      <div className="flex flex-col gap-2 p-2">
        <h1 className="text-[#0d101b] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
          Pakia Sauti (Upload Audio)
        </h1>
        <p className="text-[#4c599a] text-base font-normal leading-normal max-w-2xl">
          Generate structured summaries and accurate transcripts from your meetings, lectures, or interviews.{' '}
          <span className="text-primary font-medium">Supported in English & Swahili.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Left Column: Upload & Record Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <RecordPanel
            onRecordingReady={(file, origin) => {
              addFile(file, origin);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
          />

          <DragDropZone
            dragActive={dragAndDrop.dragActive}
            onDragOver={dragAndDrop.handleDragOver}
            onDragLeave={dragAndDrop.handleDragLeave}
            onDrop={dragAndDrop.handleDrop}
            onFileInput={dragAndDrop.handleFileInput}
          />

          <FileList files={uploadedFiles} onDeleteFile={removeFile} />
        </div>

        {/* Right Column: Settings Panel */}
        <div className="lg:col-span-1">
          <SettingsPanel
            settings={settings}
            onOutputOptionsChange={updateOutputOptions}
            onStartTranscription={handleStartTranscription}
            hasReadyFiles={hasReadyFiles}
            isUploading={uploading}
          />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toast
        type="success"
        title="Faili limepakiwa kikamilifu!"
        message="File uploaded successfully."
        onClose={() => setShowToast(false)}
        show={showToast}
      />

      {error && (
        <Toast
          type="error"
          title="Error"
          message={error}
          onClose={() => {}}
          show={!!error}
        />
      )}
    </div>
  );
}

