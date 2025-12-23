/** Audio player component */
import React from 'react';

interface AudioPlayerProps {
  currentTime?: string;
  duration?: string;
  progress?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTime = '01:17',
  duration = '45:12',
  progress = 35,
}) => {
  return (
    <div className="mx-4 mt-2 mb-8 p-4 bg-white rounded-2xl shadow-sm border border-[#e7e9f3] flex flex-col md:flex-row items-center gap-4 md:gap-6">
      <div className="flex items-center justify-center shrink-0">
        <button className="flex shrink-0 items-center justify-center rounded-full size-12 bg-primary text-[#f8f9fc] hover:bg-blue-700 transition shadow-md">
          <span className="material-symbols-outlined text-[28px] ml-0.5">play_arrow</span>
        </button>
      </div>
      <div className="flex-1 w-full min-w-0 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-medium text-[#4c599a] tracking-wide">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
        <div className="relative w-full h-12 flex items-center cursor-pointer group">
          {/* Waveform Visual */}
          <div className="absolute inset-0 flex items-center justify-between gap-[2px] opacity-30">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              ></div>
            ))}
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden relative z-10">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div
            className="absolute left-[35%] top-1/2 -translate-y-1/2 size-4 bg-primary border-2 border-white rounded-full shadow z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <button className="text-[#4c599a] hover:text-primary transition">
          <span className="material-symbols-outlined">speed</span>
        </button>
        <button className="text-[#4c599a] hover:text-primary transition">
          <span className="material-symbols-outlined">volume_up</span>
        </button>
      </div>
    </div>
  );
};

