import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ShowcasePage } from '@/pages/ShowcasePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/showcase" element={<ShowcasePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
