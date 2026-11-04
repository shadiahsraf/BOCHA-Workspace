import { useEffect, type ReactNode } from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';
import { useThemeStore } from '@/stores/themeStore';
import { useLocaleStore } from '@/stores/localeStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { useDirection } from '@/hooks/useDirection';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const syncWithSystem = useThemeStore((s) => s.syncWithSystem);
  const { direction } = useDirection();

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
      if (event.key === 'lifeos-locale' || event.key === null) {
        useLocaleStore.persist.rehydrate();
      }
      if (event.key === 'lifeos-layout' || event.key === null) {
        useLayoutStore.persist.rehydrate();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <DirectionProvider dir={direction}>{children}</DirectionProvider>;
}
