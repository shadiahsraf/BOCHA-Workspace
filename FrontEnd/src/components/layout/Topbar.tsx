import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, User, Settings, LogOut, Sun, Moon, Laptop, Globe, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useThemeStore } from '@/stores/themeStore';
import { useLocaleStore } from '@/stores/localeStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/i18n/useTranslation';

export function Topbar() {
  const navigate = useNavigate();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const toggleMobileSidebar = useLayoutStore((s) => s.toggleMobileSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();

  const userInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'LO';

  return (
    <header className="h-[60px] min-h-[60px] flex items-center justify-between border-b border-border bg-surface px-4 lg:px-6 z-10 shrink-0">
      {/* Left side: Mobile menu toggle + Page title / Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3">
        <IconButton
          variant="ghost"
          size="sm"
          onClick={toggleMobileSidebar}
          className="md:hidden me-1 text-text-secondary hover:text-text-primary"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </IconButton>
        <h1 className="text-sm font-semibold text-text-primary tracking-tight">
          {t('common.appName')}
        </h1>
        <span className="hidden md:inline-block text-xs text-text-secondary">/</span>
        <span className="hidden md:inline-block text-xs text-text-secondary-accessible">
          Workspace
        </span>
      </div>

      {/* Right side: Quick Search, AI Assistant, User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search Button */}
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-surface-secondary/40 text-xs text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
          aria-label="Quick search (⌘K)"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="pe-3">Search...</span>
          <Badge
            variant="outline"
            size="sm"
            className="font-mono text-[10px] px-1.5 py-0 border-border/80"
          >
            ⌘K
          </Badge>
        </button>

        {/* AI Assistant Button */}
        <Button variant="primary" size="sm" className="shadow-xs gap-1.5">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label="User account menu"
            >
              <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-border hover:ring-primary transition-all">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback className="text-xs font-semibold bg-surface-secondary text-text-primary">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-0.5">
                <span className="text-sm font-medium text-text-primary">
                  {user?.username || 'LifeOS User'}
                </span>
                <span className="text-xs text-text-secondary truncate">
                  {user?.email || 'user@lifeos.app'}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="me-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="me-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Quick Language Toggle */}
            <DropdownMenuItem onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>
              <Globe className="me-2 h-4 w-4" />
              <span>{locale === 'en' ? 'Switch to العربية' : 'Switch to English'}</span>
            </DropdownMenuItem>
            {/* Quick Theme Toggle */}
            <DropdownMenuItem
              onClick={() => {
                if (theme === 'light') setTheme('dark');
                else if (theme === 'dark') setTheme('system');
                else setTheme('light');
              }}
            >
              {theme === 'dark' ? (
                <Moon className="me-2 h-4 w-4" />
              ) : theme === 'light' ? (
                <Sun className="me-2 h-4 w-4" />
              ) : (
                <Laptop className="me-2 h-4 w-4" />
              )}
              <span className="capitalize">Theme: {theme}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="me-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Topbar;
