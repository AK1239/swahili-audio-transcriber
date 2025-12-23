/** Deferred topics card component */
import React from 'react';

interface DeferredTopicsCardProps {
  topics: string[];
  onCopy?: () => void;
}

export const DeferredTopicsCard: React.FC<DeferredTopicsCardProps> = ({ topics, onCopy }) => {
  const safeTopics = topics || [];
  
  if (safeTopics.length === 0) {
    return (
      <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-[#e7e9f3] p-6 md:p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -right-4 -top-4 size-24 bg-amber-50 rounded-full blur-2xl"></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <h3 className="text-lg font-bold text-[#0d101b]">Masuala Yaliyoahirishwa</h3>
          </div>
        </div>
        <div className="relative z-10 text-center py-8 text-[#4c599a]">
          <p className="text-sm">Hakuna masuala yaliyoahirishwa</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-[#e7e9f3] p-6 md:p-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 size-24 bg-amber-50 rounded-full blur-2xl"></div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <h3 className="text-lg font-bold text-[#0d101b]">Masuala Yaliyoahirishwa</h3>
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
      <ul className="flex flex-col gap-4 relative z-10">
        {safeTopics.map((topic, index) => (
          <li
            key={index}
            className="flex gap-4 p-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/50"
          >
            <div className="mt-0.5 text-amber-500">
              <span className="material-symbols-outlined">pause_circle</span>
            </div>
            <div>
              <p className="text-base text-[#0d101b] font-medium">{topic}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

