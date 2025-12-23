/** Action items card component */
import React from 'react';
import { ActionItem } from '../../../types/summary';
import { SummaryCard } from './SummaryCard';

interface ActionItemsCardProps {
  actionItems: ActionItem[];
  onCopy?: () => void;
}

export const ActionItemsCard: React.FC<ActionItemsCardProps> = ({ actionItems, onCopy }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sw-KE', { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const safeActionItems = actionItems || [];

  if (safeActionItems.length === 0) {
    return (
      <SummaryCard
        title="Kazi za Kufuatilia"
        icon="check_circle"
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
        onCopy={onCopy}
        content={
          <div className="text-center py-8 text-[#4c599a]">
            <p className="text-sm">Hakuna kazi za kufuatilia</p>
          </div>
        }
      />
    );
  }

  return (
    <SummaryCard
      title="Kazi za Kufuatilia"
      icon="check_circle"
      iconBg="bg-purple-50"
      iconColor="text-purple-600"
      onCopy={onCopy}
      content={
        <div className="flex flex-col gap-4">
          {safeActionItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-background-light hover:bg-gray-100 transition cursor-pointer group"
            >
              <div className="mt-0.5 text-gray-400 group-hover:text-primary transition">
                <span className="material-symbols-outlined text-[20px]">radio_button_unchecked</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0d101b]">{item.task}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="size-5 rounded-full bg-cover bg-center bg-gray-300"></div>
                  <span className="text-xs text-[#4c599a] font-medium">
                    {item.person} {item.dueDate && `• ${formatDate(item.dueDate)}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
};

