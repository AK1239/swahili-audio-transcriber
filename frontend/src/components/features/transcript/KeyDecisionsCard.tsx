/** Key decisions card component */
import React from 'react';
import { SummaryCard } from './SummaryCard';

interface KeyDecisionsCardProps {
  decisions: string[];
  onCopy?: () => void;
  copied?: boolean;
}

export const KeyDecisionsCard: React.FC<KeyDecisionsCardProps> = ({ decisions, onCopy, copied = false }) => {
  const safeDecisions = decisions || [];

  if (safeDecisions.length === 0) {
    return (
      <SummaryCard
        title="Maamuzi Muhimu"
        icon="gavel"
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        onCopy={onCopy}
        copied={copied}
        content={
          <div className="text-center py-8 text-[#4c599a]">
            <p className="text-sm">Hakuna maamuzi muhimu</p>
          </div>
        }
      />
    );
  }

  return (
    <SummaryCard
      title="Maamuzi Muhimu"
      icon="gavel"
      iconBg="bg-emerald-50"
      iconColor="text-emerald-600"
      onCopy={onCopy}
      copied={copied}
      content={
        <ul className="flex flex-col gap-4">
          {safeDecisions.map((decision, index) => (
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

