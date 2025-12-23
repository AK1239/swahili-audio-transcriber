/** Audio player component */
import React, { useRef, useState, useEffect } from 'react';
import { endpoints } from '../../../api/endpoints';
import { config } from '../../../config/env';

interface AudioPlayerProps {
  transcriptionId: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ transcriptionId }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isSeekingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const audioUrl = `${config.apiUrl}${endpoints.audio(transcriptionId)}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (isSeekingRef.current) return;
      
      if (audio.duration && isFinite(audio.duration)) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', updateDuration);
    audio.addEventListener('canplay', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', updateDuration);
      audio.removeEventListener('canplay', updateDuration);
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
    e.preventDefault();
    e.stopPropagation();
    
    const audio = audioRef.current;
    if (!audio) return;
    
    const audioDuration = audio.duration;
    if (!audioDuration || !isFinite(audioDuration) || audioDuration <= 0) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const newTime = percentage * audioDuration;
    
    if (isFinite(newTime) && newTime >= 0 && newTime <= audioDuration) {
      isSeekingRef.current = true;
      const wasPlaying = !audio.paused;
      
      if (wasPlaying) {
        audio.pause();
      }
      
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage * 100);
      
      const handleSeeked = () => {
        const actualTime = audio.currentTime;
        
        if (Math.abs(actualTime - newTime) > 1 && actualTime < 1) {
          setTimeout(() => {
            if (audio.readyState >= 1) {
              audio.currentTime = newTime;
              
              setTimeout(() => {
                const retryTime = audio.currentTime;
                isSeekingRef.current = false;
                setCurrentTime(retryTime);
                setProgress((retryTime / audioDuration) * 100);
                
                if (wasPlaying) {
                  audio.play().catch(() => {});
                }
              }, 200);
            }
          }, 100);
        } else {
          isSeekingRef.current = false;
          setCurrentTime(actualTime);
          setProgress((actualTime / audioDuration) * 100);
          
          if (wasPlaying) {
            audio.play().catch(() => {});
          }
        }
        
        audio.removeEventListener('seeked', handleSeeked);
      };
      
      audio.addEventListener('seeked', handleSeeked);
      
      setTimeout(() => {
        if (isSeekingRef.current) {
          isSeekingRef.current = false;
          const actualTime = audio.currentTime;
          
          if (Math.abs(actualTime - newTime) > 1 && actualTime < 1) {
            audio.currentTime = newTime;
            
            setTimeout(() => {
              const finalTime = audio.currentTime;
              setCurrentTime(finalTime);
              setProgress((finalTime / audioDuration) * 100);
              
              if (wasPlaying) {
                audio.play().catch(() => {});
              }
            }, 100);
          } else {
            setCurrentTime(actualTime);
            setProgress((actualTime / audioDuration) * 100);
            
            if (wasPlaying) {
              audio.play().catch(() => {});
            }
          }
        }
        
        audio.removeEventListener('seeked', handleSeeked);
      }, 500);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} preload="auto" />
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
          >
            {/* Waveform Visual */}
            <div className="absolute inset-0 flex items-center justify-between gap-[2px] opacity-30 pointer-events-none">
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                ></div>
              ))}
            </div>
            {/* Progress Bar */}
            <div 
              className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden relative z-10 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-primary rounded-full transition-all pointer-events-none"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 size-4 bg-primary border-2 border-white rounded-full shadow z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${progress}% - 8px)` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};
