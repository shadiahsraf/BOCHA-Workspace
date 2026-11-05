import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useLayoutStore } from '@/stores/layoutStore';

export interface AppLayoutProps {
  isMobileSidebarOpen?: boolean;
}

export function AppLayout({ isMobileSidebarOpen: mobileOpenProp }: AppLayoutProps = {}) {
  const storeMobileOpen = useLayoutStore((s) => s.isMobileSidebarOpen);
  const isMobileSidebarOpen = mobileOpenProp !== undefined ? mobileOpenProp : storeMobileOpen;
  const setMobileSidebarOpen = useLayoutStore((s) => s.setMobileSidebarOpen);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-screen w-screen overflow-hidden flex bg-background text-text-primary relative">
        {/* Mobile Backdrop Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in-0"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Fixed Collapsible Navigation Sidebar */}
        <Sidebar mobileOpen={isMobileSidebarOpen} />

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
