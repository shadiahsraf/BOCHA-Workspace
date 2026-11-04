import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  Notebook,
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
  { label: 'Inbox', to: '/inbox', icon: Inbox, badge: '3' },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Notes', to: '/notes', icon: Notebook },
  { label: 'Calendar', to: '/calendar', icon: Calendar },
  { label: 'Design System', to: '/showcase', icon: Palette },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed }: SidebarProps = {}) {
  const isStoreCollapsed = useLayoutStore((s) => s.isSidebarCollapsed);
  const isSidebarCollapsed = collapsed !== undefined ? collapsed : isStoreCollapsed;
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        'h-screen shrink-0 border-e border-border bg-surface z-20 flex flex-col transition-[width] duration-200 ease-in-out motion-reduce:transition-none select-none',
        isSidebarCollapsed ? 'w-[72px]' : 'w-[250px]'
      )}
      aria-label="Application Sidebar"
    >
      {/* Header (60px) */}
      <div
        className={cn(
          'h-[60px] min-h-[60px] border-b border-border flex items-center px-4',
          isSidebarCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
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
        )}

        <IconButton
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
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
                      className={({ isActive }) =>
                        cn(
                          'flex h-10 w-10 mx-auto items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          isActive
                            ? 'bg-primary-soft text-text-primary dark:text-primary font-medium'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary/80'
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="sr-only">{item.label}</span>
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">
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
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-border">
          <div className="p-2.5 rounded-lg bg-surface-secondary/40 border border-border text-xs text-text-secondary flex flex-col gap-1">
            <span className="font-medium text-text-primary">LifeOS v0.1.0</span>
            <span className="text-[11px] text-text-secondary-accessible">Phase 5 Navigation</span>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
