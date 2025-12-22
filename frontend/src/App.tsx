import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FileUpload } from './components/features/upload/FileUpload';
import { TranscriptView } from './components/features/transcript/TranscriptView';
import { SummaryView } from './components/features/summary/SummaryView';
import { Layout } from './components/layout/Layout';
import { Transcription } from './types/transcription';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  
  const handleUploadSuccess = (newTranscription: Transcription) => {
    setTranscription(newTranscription);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <div className="space-y-8">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          
          {transcription && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TranscriptView transcriptionId={transcription.id} />
              <SummaryView transcriptionId={transcription.id} />
            </div>
          )}
        </div>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
