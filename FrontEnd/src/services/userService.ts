import { api } from '@/lib/api';
import type { UserProfile } from '@/stores/authStore';
import type { BackendUserProfile, ChangePasswordPayload } from '@/types/api';

export const userService = {
  /**
   * Updates current user profile (email, username, preferred_language, preferred_theme)
   * on the DRF backend and returns normalized UserProfile.
   */
  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    const backendData: Record<string, unknown> = {};
    if (payload.email !== undefined) backendData.email = payload.email;
    if (payload.username !== undefined) backendData.username = payload.username;
    if (payload.preferredLanguage !== undefined) {
      backendData.preferred_language = payload.preferredLanguage;
    }
    if (payload.preferredTheme !== undefined) {
      backendData.preferred_theme = payload.preferredTheme;
    }

    const response = await api.patch<BackendUserProfile>('users/me/', backendData);
    const data = response.data;

    return {
      id: data.id,
      email: data.email,
      username: data.username,
      preferredLanguage: data.preferred_language || 'en',
      preferredTheme: data.preferred_theme || 'system',
    };
  },

  /**
   * Changes current authenticated user's password on the DRF backend.
   */
  async changePassword(payload: ChangePasswordPayload): Promise<{ detail: string }> {
    const response = await api.post<{ detail: string }>('users/change-password/', payload);
    return response.data;
  },
};
