import { request } from './client';
import type { AdminStats, AdminUser } from '../types/admin';

export async function getAdminStats(): Promise<AdminStats> {
  return request<AdminStats>('/api/admin/stats', {
    method: 'GET',
    headers: {
      'X-Admin-Key': 'admin_japan_secret_key_2026',
    },
  });
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return request<AdminUser[]>('/api/admin/users', {
    method: 'GET',
    headers: {
      'X-Admin-Key': 'admin_japan_secret_key_2026',
    },
  });
}

export async function updateUserSubscription(userId: number, status: 'FREE' | 'PRO'): Promise<AdminUser> {
  return request<AdminUser>(`/api/admin/users/${userId}/subscription`, {
    method: 'PUT',
    headers: {
      'X-Admin-Key': 'admin_japan_secret_key_2026',
    },
    body: JSON.stringify({ subscriptionStatus: status }),
  });
}
