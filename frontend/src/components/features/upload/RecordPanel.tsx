/** Record audio panel component */
import React from 'react';
import { Button } from '../../ui/Button';
import { useAudioRecorder } from '../../../hooks/useAudioRecorder';

interface RecordPanelProps {
  /** Called when a new recording is ready to be sent for transcription */
  onRecordingReady: (file: File) => void;
}

export const RecordPanel: React.FC<RecordPanelProps> = ({ onRecordingReady }) => {
  const {
    status,
    isRecording,
    durationSeconds,
    audioFile,
    error,
    startRecording,
    stopRecording,
    reset,
    hasRecording,
  } = useAudioRecorder({ maxDurationSeconds: 60 * 60 }); // up to 60 minutes

  const formattedDuration = new Date(durationSeconds * 1000)
    .toISOString()
    .substring(11, 19);

  const handleStart = async () => {
    await startRecording();
  };

  const handleSend = () => {
    if (audioFile) {
      onRecordingReady(audioFile);
      // Keep the recording visible but allow user to re-record if they want
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white border border-[#e7e9f3] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">mic</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#0d101b]">
              Rekodi Mkutano Moja kwa Moja
            </span>
            <span className="text-xs text-[#4c599a]">
              Tumia kipaza sauti chako kurekodi na kisha tutatengeneza transcript na muhtasari.
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 border border-[#e7e9f3] rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`size-3 rounded-full ${
              isRecording ? 'bg-red-500 animate-pulse' : status === 'stopped' ? 'bg-green-500' : 'bg-green-400'
            }`}
          ></span>
          <span className="text-sm font-semibold text-[#0d101b]">
            {isRecording ? 'Inarekodi sasa...' : status === 'stopped' ? 'Imemaliza kurekodi' : 'Tayari kurekodi'}
          </span>
        </div>
        <span className="font-mono text-sm font-bold text-[#0d101b]">{formattedDuration}</span>
      </div>

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {!isRecording && status !== 'stopped' && (
          <Button
            variant="default"
            className="flex items-center gap-2 rounded-xl px-6 h-11 bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all"
            onClick={handleStart}
          >
            <span className="material-symbols-outlined text-lg">fiber_manual_record</span>
            <span>Anza kurekodi</span>
          </Button>
        )}

        {isRecording && (
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-xl px-6 h-11 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 text-sm font-bold transition-all"
            onClick={stopRecording}
          >
            <span className="material-symbols-outlined text-lg">stop_circle</span>
            <span>Simamisha</span>
          </Button>
        )}

        {status === 'stopped' && hasRecording && (
          <>
            <Button
              variant="default"
              className="flex items-center gap-2 rounded-xl px-6 h-11 bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all"
              onClick={handleSend}
            >
              <span className="material-symbols-outlined text-lg">send</span>
              <span>Tuma kwa transcription</span>
            </Button>
            <Button
              variant="ghost"
              className="text-sm text-[#4c599a] hover:text-primary hover:bg-gray-50 rounded-xl px-4 h-11 transition-all"
              onClick={handleReset}
            >
              Rekodi tena
            </Button>
          </>
        )}
      </div>

      {status === 'stopped' && audioFile && (
        <div className="bg-gray-50 border border-[#e7e9f3] rounded-lg px-3 py-2">
          <p className="text-xs text-[#4c599a]">
            Faili: <span className="font-mono font-semibold text-[#0d101b]">{audioFile.name}</span> ({Math.round(audioFile.size / 1024)} KB)
          </p>
        </div>
      )}
    </div>
  );
};


