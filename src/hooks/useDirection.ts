import { useLocaleStore, getDirectionForLocale, type Direction } from '@/stores/localeStore';

export interface DirectionInfo {
  direction: Direction;
  isRtl: boolean;
  isLtr: boolean;
}

export function useDirection(): DirectionInfo {
  const locale = useLocaleStore((s) => s.locale);
  const direction = getDirectionForLocale(locale);

  return {
    direction,
    isRtl: direction === 'rtl',
    isLtr: direction === 'ltr',
  };
}
