import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProviders } from '@/app/providers';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { InboxPage } from '@/pages/InboxPage';
import { AgentPage } from '@/pages/AgentPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { TasksPage } from '@/pages/TasksPage';
import { NotesPage } from '@/pages/NotesPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ShowcasePage } from '@/pages/ShowcasePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useLocaleStore } from '@/stores/localeStore';

export function App() {
  const preferredTheme = useAuthStore((state) => state.user?.preferredTheme);
  const preferredLanguage = useAuthStore((state) => state.user?.preferredLanguage);
  const setTheme = useThemeStore((state) => state.setTheme);
  const setLocale = useLocaleStore((state) => state.setLocale);

  // Sync authenticated user theme preference with UI
  useEffect(() => {
    if (preferredTheme) {
      setTheme(preferredTheme);
    }
  }, [preferredTheme, setTheme]);

  // Sync authenticated user language preference with UI
  useEffect(() => {
    if (preferredLanguage) {
      setLocale(preferredLanguage);
    }
  }, [preferredLanguage, setLocale]);

  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/agent" element={<AgentPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/showcase" element={<ShowcasePage />} />
            </Route>
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2A1B14',
            color: '#F5F2EB',
            borderRadius: '8px',
            border: '1px solid #3F2B22',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#C17767',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#CE2C31',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </AppProviders>
  );
}

export default App;
