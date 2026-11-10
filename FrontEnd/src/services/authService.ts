import { api } from '@/lib/api';

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number | string;
    email: string;
    username: string;
    preferred_language?: 'en' | 'ar';
    preferred_theme?: 'light' | 'dark' | 'system';
    bio?: string;
  };
}

export async function googleLogin(token: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('auth/google/', { token });
  return response.data;
}

export const authService = {
  googleLogin,
};

export default authService;
