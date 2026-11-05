import { useDirection as useRadixDirection } from '@radix-ui/react-direction';
import { useLocaleStore, getDirectionForLocale, type Direction } from '@/stores/localeStore';

export interface DirectionInfo {
  direction: Direction;
  isRtl: boolean;
  isLtr: boolean;
}

/**
 * Returns the current reading direction and helper booleans.
 * Resolves with priority: explicit localDir > Radix DirectionProvider context > localeStore.
 */
export function useDirection(localDir?: Direction): DirectionInfo {
  let radixDir: Direction | undefined;
  try {
    radixDir = useRadixDirection(localDir);
  } catch {
    // Gracefully handle non-React or test environments without context
  }

  const locale = useLocaleStore((s) => s.locale);
  const storeDir = getDirectionForLocale(locale);

  let direction: Direction;
  if (localDir) {
    direction = localDir;
  } else if (radixDir === 'rtl' || storeDir === 'rtl') {
    direction = 'rtl';
  } else {
    direction = 'ltr';
  }

  return {
    direction,
    isRtl: direction === 'rtl',
    isLtr: direction === 'ltr',
  };
}
