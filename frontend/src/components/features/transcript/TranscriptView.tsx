/** Transcript view component */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTranscript } from '../../../hooks/useTranscript';
import { useSummary } from '../../../hooks/useSummary';
import { formatDateSwahili } from '../../../utils/formatters';
import { formatTranscriptText } from '../../../utils/transcriptFormatter';
import { getDisplayName } from '../../../utils/filename';
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
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useSummary(id || null);
  const [showTranscript, setShowTranscript] = useState(false);


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

  const displayName = getDisplayName(transcript.filename || 'Untitled');

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
              {formatDateSwahili(transcript.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <AudioPlayer transcriptionId={id} />

      {/* View Transcript Button */}
      {transcript.transcriptText && (
        <div className="p-4">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#e7e9f3] text-[#0d101b] text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined">
              {showTranscript ? 'visibility_off' : 'visibility'}
            </span>
            <span>{showTranscript ? 'Ficha Nakala' : 'Ona Nakala'}</span>
          </button>
        </div>
      )}

      {/* Transcript View */}
      {showTranscript && transcript.transcriptText && (
        <div className="p-4">
          <SummaryCard
            title="Nakala Kamili"
            icon="description"
            iconBg="bg-green-50"
            iconColor="text-green-600"
            onCopy={() => navigator.clipboard.writeText(transcript.transcriptText || '')}
            content={
              <div className="prose prose-lg max-w-none text-[#0d101b] leading-relaxed">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-6 text-base md:text-lg leading-8 text-[#0d101b] first:mt-0">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {formatTranscriptText(transcript.transcriptText)}
                </ReactMarkdown>
              </div>
            }
          />
        </div>
      )}

      {/* Main Content Grid */}
      {summaryLoading ? (
        <div className="p-4">
          <ProgressBar progress={50} label="Loading summary..." />
          <p className="text-[#4c599a] mt-2">Fetching summary data...</p>
        </div>
      ) : summaryError ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            {summaryError instanceof Error 
              ? summaryError.message.includes('404') || summaryError.message.includes('no summary')
                ? 'Summary is still being generated. Please wait a moment and refresh.'
                : `Error loading summary: ${summaryError.message}`
              : 'Error loading summary. Please try refreshing the page.'}
          </p>
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 p-4">
          {/* Brief Summary */}
          <div className="lg:col-span-8">
            <SummaryCard
              title="Muhtasari Mfupi"
              icon="summarize"
              iconBg="bg-blue-50"
              iconColor="text-primary"
              onCopy={() => navigator.clipboard.writeText(summary.muhtasari || '')}
              content={
                summary.muhtasari && summary.muhtasari.trim() ? (
                  <div className="prose prose-blue max-w-none text-[#0d101b] leading-relaxed text-base md:text-lg">
                    <div className="whitespace-pre-wrap">{summary.muhtasari}</div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#4c599a]">
                    <p className="text-sm">Haipatikani</p>
                  </div>
                )
              }
            />
          </div>

          {/* Action Items */}
          <div className="lg:col-span-4">
            <ActionItemsCard
              actionItems={summary.kazi || []}
              onCopy={() => {
                const kazi = summary.kazi || [];
                if (kazi.length > 0) {
                  navigator.clipboard.writeText(JSON.stringify(kazi, null, 2));
                }
              }}
            />
          </div>

          {/* Key Decisions */}
          <div className="lg:col-span-6">
            <KeyDecisionsCard
              decisions={summary.maamuzi || []}
              onCopy={() => {
                const maamuzi = summary.maamuzi || [];
                if (maamuzi.length > 0) {
                  navigator.clipboard.writeText(maamuzi.join('\n'));
                }
              }}
            />
          </div>

          {/* Deferred Topics */}
          <div className="lg:col-span-6">
            <DeferredTopicsCard
              topics={summary.masualaYaliyoahirishwa || []}
              onCopy={() => {
                const topics = summary.masualaYaliyoahirishwa || [];
                if (topics.length > 0) {
                  navigator.clipboard.writeText(topics.join('\n'));
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Summary is still being generated. This may take a few moments. Please refresh the page in a moment.
          </p>
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

