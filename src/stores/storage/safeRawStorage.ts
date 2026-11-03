import type { SyncRawStorage } from './types';

/**
 * SafeRawStorage provides a robust synchronous wrapper around browser `localStorage`.
 *
 * Resilience features:
 * - Safely handles environments where `window` or `window.localStorage` is undefined or throws (e.g., restricted iframes, Safari Private Browsing).
 * - Probes storage availability during initialization.
 * - Immediately marks storage unavailable upon any persistent I/O failure (QuotaExceededError, SecurityError) to prevent repeated throwing operations.
 * - Maintains an in-memory Map fallback for the active session.
 * - Caches successful persistent reads in memory.
 * - Deletes cached values when a successful persistent read returns null.
 * - Updates the memory cache before attempting persistent writes, and purges before persistent removals.
 * - Avoids repeated localStorage operations after storage becomes unavailable.
 * - Never throws storage exceptions into application code.
 *
 * Note: The in-memory fallback is per-window/session and does not provide cross-tab synchronization when localStorage is disabled or restricted.
 */
export class SafeRawStorage implements SyncRawStorage {
  private memoryFallback = new Map<string, string>();
  private isStorageAvailable: boolean;

  constructor() {
    this.isStorageAvailable = this.probeStorage();
  }

  /**
   * Safely probes whether `window.localStorage` is accessible and writable.
   */
  private probeStorage(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      const storage = window.localStorage;
      if (!storage) {
        return false;
      }
      const probeKey = '__lifeos_storage_probe__';
      storage.setItem(probeKey, probeKey);
      storage.removeItem(probeKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Safely retrieves the browser's localStorage reference.
   * Returns null if window is undefined or property access throws.
   */
  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return window.localStorage ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Marks persistent storage as unavailable for the remainder of the session.
   */
  private markUnavailable(): void {
    this.isStorageAvailable = false;
  }

  getItem(name: string): string | null {
    if (this.isStorageAvailable) {
      try {
        const storage = this.getStorage();
        if (!storage) {
          this.markUnavailable();
          return this.memoryFallback.get(name) ?? null;
        }

        const value = storage.getItem(name);
        if (value !== null) {
          // Cache successful read in memory
          this.memoryFallback.set(name, value);
          return value;
        } else {
          // Key does not exist in persistent storage: keep memory cache consistent
          this.memoryFallback.delete(name);
          return null;
        }
      } catch {
        // Storage operation failed: mark unavailable and fall back to memory
        this.markUnavailable();
      }
    }
    return this.memoryFallback.get(name) ?? null;
  }

  setItem(name: string, value: string): void {
    // 1. Update memory cache before attempting persistent write
    this.memoryFallback.set(name, value);

    // 2. Attempt persistent write if storage is available
    if (this.isStorageAvailable) {
      try {
        const storage = this.getStorage();
        if (!storage) {
          this.markUnavailable();
          return;
        }
        storage.setItem(name, value);
      } catch {
        this.markUnavailable();
      }
    }
  }

  removeItem(name: string): void {
    // 1. Remove from memory cache before attempting persistent removal
    this.memoryFallback.delete(name);

    // 2. Attempt persistent removal if storage is available
    if (this.isStorageAvailable) {
      try {
        const storage = this.getStorage();
        if (!storage) {
          this.markUnavailable();
          return;
        }
        storage.removeItem(name);
      } catch {
        this.markUnavailable();
      }
    }
  }
}

export const safeRawStorage = new SafeRawStorage();
