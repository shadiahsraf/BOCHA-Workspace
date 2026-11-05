import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { createValidatedPersistStorage } from './storage/validatedStorage';

export interface UserProfile {
  id: number | string;
  email: string;
  username: string;
  preferredLanguage: 'en' | 'ar';
  preferredTheme: 'light' | 'dark' | 'system';
  bio?: string;
}

export interface RegisterPayload {
  email: string;
  username?: string;
  password: string;
  password_confirm: string;
  preferred_language?: 'en' | 'ar';
  preferred_theme?: 'light' | 'dark' | 'system';
}

export interface PersistedAuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface AuthState extends PersistedAuthState {
  isLoading: boolean;
  error: string | null;
  setAuth: (tokens: { access: string; refresh?: string }, user?: UserProfile) => void;
  setUser: (user: UserProfile) => void;
  updateUser: (userData: Partial<UserProfile>) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<string | null>;
}

export function isPersistedAuthState(val: unknown): val is PersistedAuthState {
  if (!val || typeof val !== 'object') return false;
  const obj = val as Record<string, unknown>;
  const hasValidAuth = typeof obj.isAuthenticated === 'boolean';
  const hasValidTokens =
    (obj.accessToken === null || typeof obj.accessToken === 'string') &&
    (obj.refreshToken === null || typeof obj.refreshToken === 'string');
  return hasValidAuth && hasValidTokens;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (tokens, user) => {
        set((state) => ({
          accessToken: tokens.access,
          refreshToken: tokens.refresh ?? state.refreshToken,
          user: user ?? state.user,
          isAuthenticated: true,
          error: null,
        }));
      },

      setUser: (user) => {
        set({ user });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}token/`, credentials, {
            headers: { 'Content-Type': 'application/json' },
          });

          const { access, refresh, user: rawUser } = response.data;
          const user: UserProfile = {
            id: rawUser.id,
            email: rawUser.email,
            username: rawUser.username,
            preferredLanguage: rawUser.preferred_language || 'en',
            preferredTheme: rawUser.preferred_theme || 'system',
            bio: rawUser.bio || '',
          };

          set({
            accessToken: access,
            refreshToken: refresh,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message =
            axios.isAxiosError(err) && err.response?.data?.detail
              ? String(err.response.data.detail)
              : 'Invalid email or password.';
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}auth/register/`, payload, {
            headers: { 'Content-Type': 'application/json' },
          });

          const { access, refresh, user: rawUser } = response.data;
          const user: UserProfile = {
            id: rawUser.id,
            email: rawUser.email,
            username: rawUser.username,
            preferredLanguage: rawUser.preferred_language || 'en',
            preferredTheme: rawUser.preferred_theme || 'system',
            bio: rawUser.bio || '',
          };

          set({
            accessToken: access,
            refreshToken: refresh,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          let message = 'Registration failed.';
          if (axios.isAxiosError(err) && err.response?.data) {
            const data = err.response.data;
            if (typeof data === 'object') {
              const firstErr = Object.values(data)[0];
              if (Array.isArray(firstErr)) message = String(firstErr[0]);
              else if (typeof firstErr === 'string') message = firstErr;
            }
          }
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      refreshTokens: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return null;
        }

        try {
          const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccess = response.data.access;
          const newRefresh = response.data.refresh;

          set((state) => ({
            accessToken: newAccess,
            refreshToken: newRefresh || state.refreshToken,
          }));

          return newAccess;
        } catch {
          get().logout();
          return null;
        }
      },
    }),
    {
      name: 'lifeos-auth',
      version: 1,
      storage: createValidatedPersistStorage<PersistedAuthState>({
        expectedVersion: 1,
        validator: isPersistedAuthState,
      }),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
