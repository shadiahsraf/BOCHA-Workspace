/**
 * Strict synchronous raw storage interface.
 * Guarantees direct string returns with zero Promise overhead.
 */
export interface SyncRawStorage {
  getItem(name: string): string | null;
  setItem(name: string, value: string): void;
  removeItem(name: string): void;
}
