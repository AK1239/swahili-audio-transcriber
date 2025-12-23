import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/pages/LandingPage';
import { UploadPage } from './components/pages/UploadPage';
import { Layout } from './components/layout/Layout';
import { TranscriptView } from './components/features/transcript/TranscriptView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/upload"
          element={
            <Layout>
              <UploadPage />
            </Layout>
          }
        />
        <Route
          path="/transcript/:id"
          element={
            <Layout>
              <TranscriptView />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
