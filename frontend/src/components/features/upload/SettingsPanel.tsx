/** Settings panel component */
import React from 'react';
import { Button } from '../../ui/Button';
import { TranscriptionSettings, Dialect, OutputOptions } from '../../../hooks/useTranscriptionSettings';

interface SettingsPanelProps {
  settings: TranscriptionSettings;
  onDialectChange: (dialect: Dialect) => void;
  onOutputOptionsChange: (options: Partial<OutputOptions>) => void;
  onStartTranscription: () => void;
  hasReadyFiles: boolean;
  isUploading: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onDialectChange,
  onOutputOptionsChange,
  onStartTranscription,
  hasReadyFiles,
  isUploading,
}) => {
  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-[#e7e9f3] shadow-sm sticky top-6">
      <div className="border-b border-[#e7e9f3] pb-4">
        <h3 className="text-lg font-bold text-[#0d101b]">Settings / Mipangilio</h3>
        <p className="text-sm text-[#4c599a]">Configure your transcription preferences.</p>
      </div>

      {/* Dialect Selector */}
      <label className="flex flex-col gap-2">
        <span className="text-[#0d101b] text-sm font-bold">Dialect / Lahaja</span>
        <div className="relative">
          <select
            value={settings.dialect}
            onChange={(e) => onDialectChange(e.target.value as Dialect)}
            className="w-full appearance-none rounded-xl border border-[#cfd3e7] bg-[#f8f9fc] text-[#0d101b] h-12 px-4 pr-10 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
          >
            <option value="standard">Standard Swahili (Kiswahili Sanifu)</option>
            <option value="coast">Coastal Swahili (Kimvita)</option>
            <option value="congo">Congolese Swahili</option>
            <option value="sheng">Sheng (Nairobi Slang)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#4c599a]">
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </div>
      </label>

      {/* Output Options */}
      <div className="flex flex-col gap-3">
        <span className="text-[#0d101b] text-sm font-bold">Output / Matokeo</span>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-[#cfd3e7] has-checked:border-primary has-checked:bg-primary/5 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={settings.outputOptions.fullTranscript}
            onChange={(e) =>
              onOutputOptionsChange({ fullTranscript: e.target.checked })
            }
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#0d101b]">Full Transcript</span>
            <span className="text-xs text-[#4c599a]">Complete word-for-word text</span>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-[#cfd3e7] has-checked:border-primary has-checked:bg-primary/5 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={settings.outputOptions.smartSummary}
            onChange={(e) =>
              onOutputOptionsChange({ smartSummary: e.target.checked })
            }
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#0d101b]">Smart Summary</span>
            <span className="text-xs text-[#4c599a]">Key points & action items</span>
          </div>
        </label>
      </div>

      {/* Info Tip */}
      <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
        <span className="material-symbols-outlined text-primary text-xl mt-0.5">lightbulb</span>
        <p className="text-sm text-blue-900 leading-relaxed">
          <strong>Tip:</strong> Ensure your audio has minimal background noise for the best accuracy in Swahili
          dialects.
        </p>
      </div>

      {/* CTA Button */}
      <Button
        variant="default"
        onClick={onStartTranscription}
        disabled={!hasReadyFiles || isUploading}
        className="w-full flex items-center justify-center gap-2 rounded-xl h-12 bg-primary hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-primary/30 transition-all active:scale-95 mt-2"
      >
        <span>Start Transcription</span>
        <span className="material-symbols-outlined text-lg">arrow_forward</span>
      </Button>
    </div>
  );
};

