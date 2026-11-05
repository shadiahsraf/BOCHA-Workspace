import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createValidatedPersistStorage } from './storage/validatedStorage';
import { safeRawStorage } from './storage/safeRawStorage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  syncWithSystem: () => void;
}

/**
 * Type guard verifying if an unknown value is a valid ThemeMode enum.
 */
export function isThemeMode(val: unknown): val is ThemeMode {
  return val === 'light' || val === 'dark' || val === 'system';
}

/**
 * Type guard verifying if a persisted state object conforms to { theme: ThemeMode }.
 */
export function isPersistedThemeState(val: unknown): val is { theme: ThemeMode } {
  return (
    val !== null &&
    typeof val === 'object' &&
    'theme' in val &&
    isThemeMode((val as { theme: unknown }).theme)
  );
}

/**
 * Resolves the host OS color scheme via matchMedia.
 * Safely defaults to 'light' if window or matchMedia is inaccessible.
 */
export const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

/**
 * Synchronizes documentElement classes and browser colorScheme styling.
 */
export const applyThemeToDOM = (resolved: ResolvedTheme): void => {
  if (typeof document === 'undefined') {
    return;
  }
  try {
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  } catch {
    // Fail silently in non-standard or restricted DOM contexts
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: getSystemTheme(),

      setTheme: (theme: ThemeMode) => {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
        applyThemeToDOM(resolvedTheme);
        set({ theme, resolvedTheme });
      },

      syncWithSystem: () => {
        if (get().theme === 'system') {
          const resolvedTheme = getSystemTheme();
          applyThemeToDOM(resolvedTheme);
          set({ resolvedTheme });
        }
      },
    }),
    {
      name: 'lifeos-theme',
      version: 1,
      storage: createValidatedPersistStorage<{ theme: ThemeMode }>({
        expectedVersion: 1,
        validator: isPersistedThemeState,
        rawStorage: safeRawStorage,
      }),
      partialize: (state) => ({ theme: state.theme }),
      merge: (persistedState: unknown, currentState: ThemeState): ThemeState => {
        if (isPersistedThemeState(persistedState)) {
          const theme = persistedState.theme;
          const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
          return {
            ...currentState,
            theme,
            resolvedTheme,
          };
        }
        return {
          ...currentState,
          theme: 'system',
          resolvedTheme: getSystemTheme(),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.resolvedTheme);
        }
      },
    }
  )
);
