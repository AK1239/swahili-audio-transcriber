/** Summary view component */
import React from 'react';
import { useSummary } from '../../../hooks/useSummary';
import { Card } from '../../ui/Card';
import { ActionItemsList } from './ActionItemsList';

interface SummaryViewProps {
  transcriptionId: string | null;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  transcriptionId,
}) => {
  const { data: summary, isLoading, error } = useSummary(transcriptionId);
  
  if (!transcriptionId) {
    return (
      <Card title="Summary">
        <p className="text-gray-500">No transcription selected</p>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card title="Summary">
        <p className="text-gray-500">Loading summary...</p>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card title="Summary">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Error loading summary: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }
  
  if (!summary) {
    return (
      <Card title="Summary">
        <p className="text-gray-500">Summary not available yet</p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card title="Muhtasari Mfupi">
        <p className="text-gray-800">{summary.muhtasari}</p>
      </Card>
      
      {summary.maamuzi.length > 0 && (
        <Card title="Maamuzi Muhimu">
          <ul className="list-disc list-inside space-y-2">
            {summary.maamuzi.map((decision, index) => (
              <li key={index} className="text-gray-800">{decision}</li>
            ))}
          </ul>
        </Card>
      )}
      
      {summary.kazi.length > 0 && (
        <ActionItemsList items={summary.kazi} />
      )}
      
      {summary.masualaYaliyoahirishwa.length > 0 && (
        <Card title="Masuala Yaliyoahirishwa">
          <ul className="list-disc list-inside space-y-2">
            {summary.masualaYaliyoahirishwa.map((topic, index) => (
              <li key={index} className="text-gray-800">{topic}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

