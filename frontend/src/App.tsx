import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/Toaster';
import LandingPage from '@/pages/LandingPage';
import TrialPage from '@/pages/TrialPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Layout from '@/components/layout/Layout';
import RoleSelectionPage from '@/pages/RoleSelectionPage';
import CaseSelectionPage from '@/pages/CaseSelectionPage';
import TrialSetupPage from '@/pages/TrialSetupPage';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/select-role" element={<RoleSelectionPage />} />
          <Route path="/select-case" element={<CaseSelectionPage />} />
          <Route path="/trial-setup" element={<TrialSetupPage />} />
          <Route path="/trial/:sessionId" element={<TrialPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
