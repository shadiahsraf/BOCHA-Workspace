import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export function AppLayout() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-screen w-screen overflow-hidden flex bg-background text-text-primary">
        {/* Fixed Collapsible Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-surface-secondary/20 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default AppLayout;
