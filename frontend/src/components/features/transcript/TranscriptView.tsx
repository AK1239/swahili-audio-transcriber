/** Transcript view component */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranscript } from '../../../hooks/useTranscript';
import { Card } from '../../ui/Card';
import { ProgressBar } from '../../ui/ProgressBar';

export const TranscriptView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: transcript, isLoading, error, isFetching } = useTranscript(
    id || null,
  );
  
  if (!transcriptionId) {
    return (
      <Card title="Transcript">
        <p className="text-gray-500">No transcription selected</p>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card title="Transcript">
        <div className="space-y-4">
          <ProgressBar progress={50} label="Loading transcript..." />
          <p className="text-gray-500">Fetching transcript...</p>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card title="Transcript">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Error loading transcript: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }
  
  if (!transcript) {
    return (
      <Card title="Transcript">
        <p className="text-gray-500">Transcript not found</p>
      </Card>
    );
  }
  
  return (
    <Card title="Transcript">
      <div className="space-y-4">
        {isFetching && (
          <div className="text-sm text-gray-500">Updating...</div>
        )}
        
        {transcript.status === 'processing' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Transcription is being processed...
            </p>
            <ProgressBar progress={75} />
          </div>
        )}
        
        {transcript.status === 'completed' && transcript.transcriptText && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status: </span>
              <span className="text-sm font-medium text-green-600">Completed</span>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800 whitespace-pre-wrap">
                {transcript.transcriptText}
              </p>
            </div>
          </div>
        )}
        
        {transcript.status === 'failed' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Transcription failed. Please try uploading again.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

