import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
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

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Inbox', to: '/inbox', icon: Inbox },
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
        'h-screen flex flex-col bg-surface border-e border-border select-none z-50',
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
          'h-[60px] min-h-[60px] border-b border-border flex items-center px-4',
          isSidebarCollapsed ? 'max-md:justify-between md:justify-center' : 'justify-between'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2.5 overflow-hidden',
            isSidebarCollapsed && 'md:hidden'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-text-primary dark:text-background font-bold text-sm shadow-xs">
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold tracking-tight text-text-primary truncate">
              LifeOS
            </span>
            <span className="text-[10px] text-text-secondary truncate">
              Productivity Workspace
            </span>
          </div>
        </div>

        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="text-text-secondary hover:text-text-primary"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          ) : (
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          )}
        </IconButton>
      </div>

      {/* Navigation Links */}
      <TooltipProvider delayDuration={200}>
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
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
                          'flex items-center gap-3 px-3 py-2 md:px-0 md:justify-center md:h-10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          isActive
                            ? 'bg-primary-soft text-text-primary dark:text-primary font-medium'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary/80'
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate md:hidden">{item.label}</span>
                      <span className="sr-only md:inline-block md:sr-only">{item.label}</span>
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
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isActive
                      ? 'bg-primary-soft text-text-primary dark:text-primary font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary/80'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ms-auto px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-secondary text-text-secondary border border-border">
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
          'p-3 border-t border-border',
          isSidebarCollapsed && 'md:hidden'
        )}
      >
        <div className="p-2.5 rounded-lg bg-surface-secondary/40 border border-border text-xs text-text-secondary flex flex-col gap-1">
          <span className="font-medium text-text-primary">LifeOS v0.1.0</span>
          <span className="text-[11px] text-text-secondary-accessible">Phase 5 Navigation</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
