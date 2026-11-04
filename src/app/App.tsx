import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { DashboardPage } from '@/pages/DashboardPage';
import { ShowcasePage } from '@/pages/ShowcasePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* Temporary direct mapping until AppLayout is built in Step 2 */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
