import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createValidatedPersistStorage } from './storage/validatedStorage';
import { safeRawStorage } from './storage/safeRawStorage';

export interface LayoutState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
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
      isMobileSidebarOpen: false,

      toggleSidebar: () => {
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
      },

      setSidebarCollapsed: (isSidebarCollapsed: boolean) => {
        set({ isSidebarCollapsed });
      },

      toggleMobileSidebar: () => {
        set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen }));
      },

      setMobileSidebarOpen: (isMobileSidebarOpen: boolean) => {
        set({ isMobileSidebarOpen });
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
            isMobileSidebarOpen: false,
          };
        }
        return {
          ...currentState,
          isSidebarCollapsed: false,
          isMobileSidebarOpen: false,
        };
      },
    }
  )
);
