import { useEffect, type ReactNode } from 'react';
import { useThemeStore } from '@/stores/themeStore';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const syncWithSystem = useThemeStore((s) => s.syncWithSystem);

  useEffect(() => {
    // 1. Listen for host OS theme changes via matchMedia
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    let mediaQuery: MediaQueryList | null = null;
    const handleMediaChange = () => {
      syncWithSystem();
    };

    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleMediaChange);
    } catch {
      // Gracefully handle environments with restricted matchMedia
    }

    return () => {
      try {
        mediaQuery?.removeEventListener('change', handleMediaChange);
      } catch {
        // Safe cleanup
      }
    };
  }, [syncWithSystem]);

  useEffect(() => {
    // 2. Listen for cross-tab localStorage updates
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lifeos-theme' || event.key === null) {
        useThemeStore.persist.rehydrate();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <>{children}</>;
}
