export type SubscriptionStatus = 'FREE' | 'PRO';

export interface User {
  id: number;
  email: string;
  username?: string;
  subscriptionStatus: SubscriptionStatus;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  username?: string;
  subscriptionStatus: SubscriptionStatus;
  role?: string;
}
