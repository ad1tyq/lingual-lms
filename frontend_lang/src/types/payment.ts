export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface CheckoutRequest {
  plan?: string;
  amount?: number;
}

export interface CheckoutResponse {
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  message: string;
  webhookSimulatorUrl: string;
}

export interface PaymentRecord {
  id: number;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface WebhookPayload {
  transaction_id: string;
  status: string;
  amount?: number;
}
