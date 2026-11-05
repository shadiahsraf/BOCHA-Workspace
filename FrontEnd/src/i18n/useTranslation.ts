import { useLocaleStore, type Locale } from '@/stores/localeStore';
import { en } from './dictionaries/en';
import { ar } from './dictionaries/ar';
import type { TranslationKey, TranslationSchema } from './types';

const dictionaries: Record<Locale, TranslationSchema> = {
  en,
  ar,
};

function getNestedString(obj: unknown, path: string): string | undefined {
  const segments = path.split('.');
  let current: unknown = obj;

  for (const segment of segments) {
    if (current !== null && typeof current === 'object' && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const activeDict = dictionaries[locale] ?? dictionaries.en;

  const t = (key: TranslationKey): string => {
    let text = getNestedString(activeDict, key);

    // Defensive fallback to canonical English dictionary
    if (text === undefined && locale !== 'en') {
      text = getNestedString(dictionaries.en, key);
    }

    if (text === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[LifeOS i18n] Missing translation key: "${key}" for locale: "${locale}"`);
      }
      return key;
    }

    return text;
  };

  return { t, locale };
}
