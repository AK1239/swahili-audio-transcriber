/** Key decisions card component */
import React from 'react';
import { SummaryCard } from './SummaryCard';

interface KeyDecisionsCardProps {
  decisions: string[];
  onCopy?: () => void;
}

export const KeyDecisionsCard: React.FC<KeyDecisionsCardProps> = ({ decisions, onCopy }) => {
  return (
    <SummaryCard
      title="Maamuzi Muhimu"
      icon="gavel"
      iconBg="bg-emerald-50"
      iconColor="text-emerald-600"
      onCopy={onCopy}
      content={
        <ul className="flex flex-col gap-4">
          {decisions.map((decision, index) => (
            <li key={index} className="flex gap-4">
              <div className="mt-1 size-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px] text-emerald-600 font-bold">check</span>
              </div>
              <div>
                <p className="text-base text-[#0d101b] font-medium">{decision}</p>
              </div>
            </li>
          ))}
        </ul>
      }
    />
  );
};

