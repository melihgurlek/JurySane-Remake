import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/Toaster';
import HomePage from '@/pages/HomePage';
import TrialPage from '@/pages/TrialPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Layout from '@/components/layout/Layout';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trial/:sessionId" element={<TrialPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
