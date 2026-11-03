import type { PersistStorage, StorageValue } from 'zustand/middleware';
import type { SyncRawStorage } from './types';
import { safeRawStorage } from './safeRawStorage';

export interface ValidatedStorageConfig<T> {
  expectedVersion: number;
  validator: (state: unknown) => state is T;
  rawStorage?: SyncRawStorage;
}

/**
 * Creates a validated persist storage adapter compatible with Zustand's `PersistStorage<T>`.
 *
 * Key guarantees:
 * - Reads raw values via synchronous `SyncRawStorage`.
 * - Safely handles JSON parsing; corrupt JSON returns null without throwing or disabling storage.
 * - Enforces envelope structure, numeric version matching, and runtime state validation via type guard.
 * - Serializes writes safely without crashing the application on serialization errors.
 * - Distinguishes between I/O failures (handled by SafeRawStorage) and corrupted data (handled here).
 */
export function createValidatedPersistStorage<T>({
  expectedVersion,
  validator,
  rawStorage = safeRawStorage,
}: ValidatedStorageConfig<T>): PersistStorage<T> {
  return {
    getItem: (name: string): StorageValue<T> | null => {
      const raw = rawStorage.getItem(name);
      if (raw === null) {
        return null;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Corrupt JSON string: return null for clean default hydration.
        // Persistent storage remains enabled so a future valid write can overwrite it.
        return null;
      }

      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      const envelope = parsed as Record<string, unknown>;
      if (typeof envelope.version !== 'number' || envelope.version !== expectedVersion) {
        return null;
      }

      if (!('state' in envelope) || !validator(envelope.state)) {
        return null;
      }

      return {
        state: envelope.state,
        version: envelope.version,
      };
    },

    setItem: (name: string, value: StorageValue<T>): void => {
      try {
        const serialized = JSON.stringify(value);
        rawStorage.setItem(name, serialized);
      } catch (error) {
        if (import.meta.env?.DEV) {
          console.warn(`[LifeOS ValidatedStorage] Failed to serialize state for key "${name}":`, error);
        }
      }
    },

    removeItem: (name: string): void => {
      rawStorage.removeItem(name);
    },
  };
}
