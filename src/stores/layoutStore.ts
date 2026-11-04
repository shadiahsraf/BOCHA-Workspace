import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createValidatedPersistStorage } from './storage/validatedStorage';
import { safeRawStorage } from './storage/safeRawStorage';

export interface LayoutState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export interface PersistedLayoutState {
  isSidebarCollapsed: boolean;
}

/**
 * Type guard verifying if an unknown value conforms to PersistedLayoutState.
 */
export function isPersistedLayoutState(val: unknown): val is PersistedLayoutState {
  return (
    val !== null &&
    typeof val === 'object' &&
    'isSidebarCollapsed' in val &&
    typeof (val as { isSidebarCollapsed: unknown }).isSidebarCollapsed === 'boolean'
  );
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,

      toggleSidebar: () => {
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
      },

      setSidebarCollapsed: (isSidebarCollapsed: boolean) => {
        set({ isSidebarCollapsed });
      },
    }),
    {
      name: 'lifeos-layout',
      version: 1,
      storage: createValidatedPersistStorage<PersistedLayoutState>({
        expectedVersion: 1,
        validator: isPersistedLayoutState,
        rawStorage: safeRawStorage,
      }),
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
      merge: (persistedState: unknown, currentState: LayoutState): LayoutState => {
        if (isPersistedLayoutState(persistedState)) {
          return {
            ...currentState,
            isSidebarCollapsed: persistedState.isSidebarCollapsed,
          };
        }
        return {
          ...currentState,
          isSidebarCollapsed: false,
        };
      },
    }
  )
);
