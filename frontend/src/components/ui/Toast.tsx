/** Toast notification component */
import React from 'react';

interface ToastProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
  show?: boolean;
}

export const Toast: React.FC<ToastProps> = ({ type, title, message, onClose, show = true }) => {
  if (!show) return null;

  const colors = {
    success: {
      border: 'border-green-500',
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500',
    },
    error: {
      border: 'border-red-500',
      iconBg: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-500',
    },
  };

  const icon = type === 'success' ? 'check_circle' : 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div
        className={`flex items-center gap-3 bg-white dark:bg-[#1a1d2d] border-l-4 ${colors[type].border} shadow-xl rounded-lg p-4 max-w-sm`}
      >
        <div className={`${colors[type].iconColor} ${colors[type].iconBg} rounded-full p-1`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className="font-bold text-sm text-[#0d101b] dark:text-white">{title}</p>
          <p className="text-xs text-[#4c599a] dark:text-[#94a3b8]">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-2"
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};

