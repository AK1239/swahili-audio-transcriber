/** Summary card component */
import React from 'react';

interface SummaryCardProps {
  title: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  content: React.ReactNode;
  onCopy?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  icon,
  iconBg,
  iconColor,
  content,
  onCopy,
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
            className="text-[#4c599a] hover:text-primary p-2 rounded-lg hover:bg-gray-50 transition"
            title="Nakili"
          >
            <span className="material-symbols-outlined">content_copy</span>
          </button>
        )}
      </div>
      {content}
    </div>
  );
};

