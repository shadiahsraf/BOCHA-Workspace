import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createValidatedPersistStorage } from './storage/validatedStorage';
import { safeRawStorage } from './storage/safeRawStorage';

export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/**
 * Type guard verifying if an unknown value is a supported Locale enum.
 */
export function isLocale(val: unknown): val is Locale {
  return val === 'en' || val === 'ar';
}

/**
 * Type guard verifying if a persisted state object conforms to { locale: Locale }.
 */
export function isPersistedLocaleState(val: unknown): val is { locale: Locale } {
  return (
    val !== null &&
    typeof val === 'object' &&
    'locale' in val &&
    isLocale((val as { locale: unknown }).locale)
  );
}

/**
 * Derives the layout direction strictly from the locale.
 */
export function getDirectionForLocale(locale: Locale): Direction {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Synchronizes documentElement lang, dir, and root font classes.
 */
export const applyLocaleToDOM = (locale: Locale): void => {
  if (typeof document === 'undefined') {
    return;
  }
  try {
    const root = document.documentElement;
    const dir = getDirectionForLocale(locale);

    root.lang = locale;
    root.dir = dir;

    if (locale === 'ar') {
      root.classList.add('font-arabic');
      root.classList.remove('font-sans');
    } else {
      root.classList.add('font-sans');
      root.classList.remove('font-arabic');
    }
  } catch {
    // Fail silently in non-standard or restricted DOM contexts
  }
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',

      setLocale: (locale: Locale) => {
        applyLocaleToDOM(locale);
        set({ locale });
      },
    }),
    {
      name: 'lifeos-locale',
      version: 1,
      storage: createValidatedPersistStorage<{ locale: Locale }>({
        expectedVersion: 1,
        validator: isPersistedLocaleState,
        rawStorage: safeRawStorage,
      }),
      partialize: (state) => ({ locale: state.locale }),
      merge: (persistedState: unknown, currentState: LocaleState): LocaleState => {
        if (isPersistedLocaleState(persistedState)) {
          return {
            ...currentState,
            locale: persistedState.locale,
          };
        }
        return {
          ...currentState,
          locale: 'en',
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyLocaleToDOM(state.locale);
        }
      },
    }
  )
);
