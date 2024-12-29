import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ChatInterface } from '@/components/shared/ChatInterface';
import { PageGuide } from '@/components/shared/PageGuide';
import { I18nextProvider } from 'react-i18next';
import LandingPage from '@/components/pages/LandingPage';
import ChatPage from '@/components/pages/ChatPage';
import DashboardPage from '@/components/pages/DashboardPage';
import HistoryPage from '@/components/pages/HistoryPage';
import InformationPage from '@/components/pages/InformationPage';
import CaseStatusPage from '@/components/pages/CaseStatusPage';
import ServicesPage from '@/components/pages/ServicesPage';
import StreamingPage from '@/components/pages/StreamingPage';
import TeleLawPage from '@/components/pages/TeleLawPage';
import LegalAidPage from '@/components/pages/LegalAidPage';
import TemplatesPage from '@/components/pages/TemplatesPage';
import ProfilePage from '@/components/pages/ProfilePage';
import SettingsPage from '@/components/pages/SettingsPage';
import i18n from './lib/i18n';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nyay-sahay-theme">
      <I18nextProvider i18n={i18n}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/information" element={<InformationPage />} />
              <Route path="/case-status" element={<CaseStatusPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/streaming" element={<StreamingPage />} />
              <Route path="/tele-law" element={<TeleLawPage />} />
              <Route path="/legal-aid" element={<LegalAidPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
          <ChatInterface />
          <PageGuide />
        </Router>
      </I18nextProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;