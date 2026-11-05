import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
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
              <Route path="/showcase" element={<ShowcasePage />} />
            </Route>
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
