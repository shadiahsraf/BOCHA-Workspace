import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  CheckSquare,
  BookOpen,
  Calendar,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layoutStore';
import { IconButton } from '@/components/ui/icon-button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Logo, LogoIcon } from '@/components/ui/Logo';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  end?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Inbox', to: '/inbox', icon: Inbox },
  { label: 'AI Agent', to: '/agent', icon: Sparkles },
  { label: 'Projects', to: '/projects', icon: Layers },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Notes', to: '/notes', icon: BookOpen },
  { label: 'Calendar', to: '/calendar', icon: Calendar },
  { label: 'Design System', to: '/showcase', icon: Palette },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
}

export function Sidebar({ collapsed, mobileOpen }: SidebarProps = {}) {
  const isStoreCollapsed = useLayoutStore((s) => s.isSidebarCollapsed);
  const isSidebarCollapsed = collapsed !== undefined ? collapsed : isStoreCollapsed;
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);
  const isStoreMobileOpen = useLayoutStore((s) => s.isMobileSidebarOpen);
  const isMobileSidebarOpen = mobileOpen !== undefined ? mobileOpen : isStoreMobileOpen;
  const setMobileSidebarOpen = useLayoutStore((s) => s.setMobileSidebarOpen);

  const handleToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && isMobileSidebarOpen) {
      setMobileSidebarOpen(false);
    } else {
      toggleSidebar();
    }
  };

  return (
    <aside
      data-mobile-open={isMobileSidebarOpen}
      className={cn(
        // Base structure
        'h-screen flex flex-col bg-brand-wood text-gray-300 border-e border-brand-wood-light select-none z-50',
        // Desktop positioning & width transition
        'md:static md:z-20 md:shrink-0 md:transition-[width] md:duration-200 md:ease-in-out md:translate-x-0',
        isSidebarCollapsed ? 'md:w-[72px]' : 'md:w-[250px]',
        // Mobile fixed drawer positioning & slide transition
        'max-md:fixed max-md:inset-y-0 max-md:start-0 max-md:w-[280px] max-md:shadow-2xl max-md:transition-transform max-md:duration-300 max-md:ease-in-out',
        isMobileSidebarOpen
          ? 'max-md:translate-x-0'
          : 'max-md:-translate-x-full rtl:max-md:translate-x-full'
      )}
      aria-label="Application Sidebar"
    >
      {/* Header (60px) */}
      <div
        className={cn(
          'h-[60px] min-h-[60px] border-b border-brand-wood-light flex items-center',
          isSidebarCollapsed
            ? 'max-md:justify-between max-md:px-4 md:justify-center md:px-2'
            : 'justify-between px-4'
        )}
      >
        {isSidebarCollapsed ? (
          <>
            {/* Mobile Header with Full Logo */}
            <div className="md:hidden flex items-center gap-2.5 overflow-hidden">
              <Logo size="sm" theme="dark" />
            </div>

            {/* Desktop Collapsed Header: Centered Logo Mark button */}
            <button
              type="button"
              onClick={handleToggle}
              title="Expand BOCHA Workspace"
              className="hidden md:flex items-center justify-center p-1 rounded-xl hover:bg-brand-wood-light transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose"
              aria-label="Expand sidebar"
            >
              <LogoIcon size="sm" />
            </button>

            {/* Mobile Close/Toggle Button */}
            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              aria-label="Toggle sidebar"
              className="md:hidden text-gray-400 hover:text-white hover:bg-brand-wood-light shrink-0"
            >
              <ChevronRight className="h-5 w-5 rtl:rotate-180" />
            </IconButton>
          </>
        ) : (
          <>
            <Logo size="sm" theme="dark" />
            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              aria-label="Collapse sidebar"
              className="text-gray-400 hover:text-white hover:bg-brand-wood-light shrink-0"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </IconButton>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <TooltipProvider delayDuration={150}>
        <nav
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-1.5',
            isSidebarCollapsed && 'md:px-2'
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            if (isSidebarCollapsed) {
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-center h-11 w-full rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose',
                          isActive
                            ? 'bg-brand-wood-light text-brand-rose font-medium shadow-xs'
                            : 'text-gray-300 hover:text-white hover:bg-brand-wood-light/80'
                        )
                      }
                    >
                      <Icon size={24} className="shrink-0" />
                      <span className="sr-only">{item.label}</span>
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="hidden md:block">
                    <span>{item.label}</span>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose',
                    isActive
                      ? 'bg-brand-wood-light text-brand-rose font-medium border-s-2 border-brand-rose'
                      : 'text-gray-300 hover:text-white hover:bg-brand-wood-light/80'
                  )
                }
              >
                <Icon size={22} className="shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ms-auto px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-wood-light text-brand-rose border border-brand-wood-light">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* Sidebar Footer */}
      <div
        className={cn(
          'p-3 border-t border-brand-wood-light',
          isSidebarCollapsed ? 'flex justify-center p-2' : ''
        )}
      >
        {isSidebarCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                aria-label="Expand sidebar"
                className="text-gray-400 hover:text-white hover:bg-brand-wood-light h-10 w-10 flex items-center justify-center shrink-0"
              >
                <ChevronRight className="h-5 w-5 shrink-0 rtl:rotate-180" />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span>Expand BOCHA Workspace</span>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="p-2.5 rounded-xl bg-brand-wood-light/60 border border-brand-wood-light text-xs text-gray-400 flex flex-col gap-1">
            <span className="font-semibold text-white font-heading">BOCHA Workspace</span>
            <span className="text-[11px] text-brand-rose">Minimalist &amp; Premium</span>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
