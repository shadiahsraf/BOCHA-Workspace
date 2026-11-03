import type { en } from './dictionaries/en';

/**
 * Recursively maps all leaf string literal types to `string`
 * while strictly preserving object structure, keys, and nesting.
 */
export type WidenStrings<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: WidenStrings<T[K]> }
    : T;

/**
 * Canonical Translation Schema derived from the English dictionary.
 */
export type TranslationSchema = WidenStrings<typeof en>;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

/**
 * Recursively extracts all dot-notated leaf property paths from an object schema.
 */
export type LeafPaths<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? T[K] extends object
          ? Join<K, LeafPaths<T[K]>>
          : `${K}`
        : never;
    }[keyof T]
  : never;

/**
 * Union of all valid, dot-notated translation keys.
 */
export type TranslationKey = LeafPaths<TranslationSchema>;
