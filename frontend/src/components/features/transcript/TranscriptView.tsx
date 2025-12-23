/** Transcript view component */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranscript } from '../../../hooks/useTranscript';
import { useSummary } from '../../../hooks/useSummary';
import { Breadcrumbs } from './Breadcrumbs';
import { AudioPlayer } from './AudioPlayer';
import { SummaryCard } from './SummaryCard';
import { ActionItemsCard } from './ActionItemsCard';
import { KeyDecisionsCard } from './KeyDecisionsCard';
import { DeferredTopicsCard } from './DeferredTopicsCard';
import { ProgressBar } from '../../ui/ProgressBar';

export const TranscriptView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: transcript, isLoading, error } = useTranscript(id || null);
  const { data: summary, isLoading: summaryLoading } = useSummary(id || null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sw-KE', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Dakika 0';
    const minutes = Math.floor(seconds / 60);
    return `Dakika ${minutes}`;
  };

  if (!id) {
    return (
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <p className="text-[#4c599a]">No transcription selected</p>
      </div>
    );
  }

  if (isLoading || summaryLoading) {
    return (
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <div className="space-y-4 p-4">
          <ProgressBar progress={50} label="Loading transcript..." />
          <p className="text-[#4c599a]">Fetching transcript...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Error loading transcript: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <p className="text-[#4c599a]">Transcript not found</p>
      </div>
    );
  }

  if (transcript.status === 'processing') {
    return (
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">Transcription is being processed...</p>
          <ProgressBar progress={75} />
        </div>
      </div>
    );
  }

  if (transcript.status === 'failed') {
    return (
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">Transcription failed. Please try uploading again.</p>
        </div>
      </div>
    );
  }

  const filename = transcript.filename || 'Untitled';
  const displayName = filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');

  return (
    <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Nyumbani', href: '/' },
          { label: 'Transkripsheni', href: '/upload' },
          { label: displayName },
        ]}
      />

      {/* Page Header & Actions */}
      <div className="flex flex-wrap justify-between items-end gap-4 p-4">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-[#0d101b] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            {displayName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[#4c599a]">
            <span className="flex items-center gap-1 text-sm font-normal">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {formatDate(transcript.createdAt)}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-sm font-normal">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              {formatDuration()}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-white border border-[#e7e9f3] text-[#0d101b] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined mr-2 text-[20px]">share</span>
            <span className="truncate">Shiriki</span>
          </button>
          <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-white border border-[#e7e9f3] text-[#0d101b] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined mr-2 text-[20px]">edit</span>
            <span className="truncate">Hariri</span>
          </button>
        </div>
      </div>

      {/* Audio Player */}
      <AudioPlayer />

      {/* Main Content Grid */}
      {summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 p-4">
          {/* Brief Summary */}
          <div className="lg:col-span-8">
            <SummaryCard
              title="Muhtasari Mfupi"
              icon="summarize"
              iconBg="bg-blue-50"
              iconColor="text-primary"
              onCopy={() => navigator.clipboard.writeText(summary.muhtasari)}
              content={
                <div className="prose prose-blue max-w-none text-[#0d101b] leading-relaxed text-base md:text-lg">
                  <div className="whitespace-pre-wrap">{summary.muhtasari}</div>
                </div>
              }
            />
          </div>

          {/* Action Items */}
          <div className="lg:col-span-4">
            <ActionItemsCard
              actionItems={summary.kazi}
              onCopy={() => navigator.clipboard.writeText(JSON.stringify(summary.kazi, null, 2))}
            />
          </div>

          {/* Key Decisions */}
          <div className="lg:col-span-6">
            <KeyDecisionsCard
              decisions={summary.maamuzi}
              onCopy={() => navigator.clipboard.writeText(summary.maamuzi.join('\n'))}
            />
          </div>

          {/* Deferred Topics */}
          <div className="lg:col-span-6">
            <DeferredTopicsCard
              topics={summary.masualaYaliyoahirishwa}
              onCopy={() => navigator.clipboard.writeText(summary.masualaYaliyoahirishwa.join('\n'))}
            />
          </div>
        </div>
      ) : (
        <div className="p-4">
          <p className="text-[#4c599a]">Summary is being generated...</p>
        </div>
      )}

      {/* Footer / Regeneration Area */}
      <div className="flex justify-center py-8 pb-12">
        <button className="group flex items-center gap-2 px-6 py-3 rounded-full bg-background-light text-[#4c599a] hover:text-primary hover:bg-blue-50 transition-all font-medium text-sm">
          <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">
            refresh
          </span>
          Zalisha Muhtasari Upya kwa AI
        </button>
      </div>
    </div>
  );
};

