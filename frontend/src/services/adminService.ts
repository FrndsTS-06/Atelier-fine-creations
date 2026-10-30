import { request } from './apiClient';
import { UserSession } from '../types/api';

export const adminService = {
  async login(email: string, password: string): Promise<{ user: UserSession; token: string }> {
    return request<{ user: UserSession; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(): Promise<UserSession> {
    return request<UserSession>('/auth/me');
  },
};
