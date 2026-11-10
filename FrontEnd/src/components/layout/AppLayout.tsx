import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useLayoutStore } from '@/stores/layoutStore';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

export interface AppLayoutProps {
  isMobileSidebarOpen?: boolean;
}

export function AppLayout({ isMobileSidebarOpen: mobileOpenProp }: AppLayoutProps = {}) {
  const location = useLocation();
  const storeMobileOpen = useLayoutStore((s) => s.isMobileSidebarOpen);
  const isMobileSidebarOpen = mobileOpenProp !== undefined ? mobileOpenProp : storeMobileOpen;
  const setMobileSidebarOpen = useLayoutStore((s) => s.setMobileSidebarOpen);

  const preferredTheme = useAuthStore((state) => state.user?.preferredTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Sync authenticated user's preferred theme with the DOM and theme store
  useEffect(() => {
    if (preferredTheme) {
      setTheme(preferredTheme);
    }
  }, [preferredTheme, setTheme]);

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
          <main className="flex-1 overflow-y-auto bg-brand-beige/40 dark:bg-surface-secondary/20 p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default AppLayout;
