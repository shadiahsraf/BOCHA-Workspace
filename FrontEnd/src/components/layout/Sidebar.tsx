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
          'h-[60px] min-h-[60px] border-b border-brand-wood-light flex items-center px-4',
          isSidebarCollapsed ? 'max-md:justify-between md:justify-center' : 'justify-between'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2.5 overflow-hidden',
            isSidebarCollapsed && 'md:hidden'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-rose text-white font-bold text-sm shadow-xs">
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold tracking-tight text-white font-heading truncate">
              LifeOS
            </span>
            <span className="text-[10px] text-gray-400 truncate">
              Productivity Workspace
            </span>
          </div>
        </div>

        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="text-gray-400 hover:text-white hover:bg-brand-wood-light"
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
                          'flex items-center gap-3 px-3 py-2 md:px-0 md:justify-center md:h-10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose',
                          isActive
                            ? 'bg-brand-wood-light text-brand-rose font-medium border-s-2 border-brand-rose md:border-s-0 md:border-b-2'
                            : 'text-gray-300 hover:text-white hover:bg-brand-wood-light/80'
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
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose',
                    isActive
                      ? 'bg-brand-wood-light text-brand-rose font-medium border-s-2 border-brand-rose'
                      : 'text-gray-300 hover:text-white hover:bg-brand-wood-light/80'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
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
          isSidebarCollapsed && 'md:hidden'
        )}
      >
        <div className="p-2.5 rounded-lg bg-brand-wood-light/60 border border-brand-wood-light text-xs text-gray-400 flex flex-col gap-1">
          <span className="font-medium text-white font-heading">LifeOS v0.1.0</span>
          <span className="text-[11px] text-gray-400">Minimalist & Premium</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
