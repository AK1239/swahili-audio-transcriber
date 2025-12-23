/** Summary card component */
import React from 'react';

interface SummaryCardProps {
  title: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  content: React.ReactNode;
  onCopy?: () => void;
  copied?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  icon,
  iconBg,
  iconColor,
  content,
  onCopy,
  copied = false,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-[#e7e9f3] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <h3 className="text-xl font-bold text-[#0d101b]">{title}</h3>
        </div>
        {onCopy && (
          <button
            onClick={onCopy}
            className={`p-2 rounded-lg transition ${
              copied
                ? 'text-green-600 bg-green-50'
                : 'text-[#4c599a] hover:text-primary hover:bg-gray-50'
            }`}
            title={copied ? 'Imenakiliwa' : 'Nakili'}
          >
            <span className="material-symbols-outlined">
              {copied ? 'check_circle' : 'content_copy'}
            </span>
          </button>
        )}
      </div>
      {content}
    </div>
  );
};

