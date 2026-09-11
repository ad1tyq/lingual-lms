import { request } from './client';
import type { AuthResponse, User } from '../types/user';

export async function registerUser(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUserProfile(): Promise<User> {
  return request<User>('/api/users/me', {
    method: 'GET',
  });
}
