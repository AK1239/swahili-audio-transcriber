/** Audio player component */
import React, { useRef, useState, useEffect } from 'react';
import { endpoints } from '../../../api/endpoints';
import { config } from '../../../config/env';

interface AudioPlayerProps {
  transcriptionId: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ transcriptionId }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const audioUrl = `${config.apiUrl}${endpoints.audio(transcriptionId)}`;

  // Update current time and progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="mx-4 mt-2 mb-8 p-4 bg-white rounded-2xl shadow-sm border border-[#e7e9f3] flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="flex items-center justify-center shrink-0">
          <button
            onClick={togglePlayPause}
            className="flex shrink-0 items-center justify-center rounded-full size-12 bg-primary text-[#f8f9fc] hover:bg-blue-700 transition shadow-md"
          >
            <span className="material-symbols-outlined text-[28px] ml-0.5">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
        <div className="flex-1 w-full min-w-0 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium text-[#4c599a] tracking-wide">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div
            className="relative w-full h-12 flex items-center cursor-pointer group"
            onClick={handleProgressClick}
          >
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
              className="absolute left-[35%] top-1/2 -translate-y-1/2 size-4 bg-primary border-2 border-white rounded-full shadow z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
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
    </>
  );
};
