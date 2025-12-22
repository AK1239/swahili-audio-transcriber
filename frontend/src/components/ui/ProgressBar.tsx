/** Progress bar component */
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

