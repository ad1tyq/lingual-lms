import { request } from './client';
import type { CheckoutRequest, CheckoutResponse, PaymentRecord, WebhookPayload } from '../types/payment';

export async function initiateCheckout(data: CheckoutRequest = {}): Promise<CheckoutResponse> {
  return request<CheckoutResponse>('/api/payments/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function simulateWebhookApproval(
  transactionId: string,
  secretKey: string = 'sec_test_webhook_key_12345'
): Promise<PaymentRecord> {
  const payload: WebhookPayload = {
    transaction_id: transactionId,
    status: 'SUCCESS',
  };

  return request<PaymentRecord>('/api/payments/webhook', {
    method: 'POST',
    headers: {
      'X-Webhook-Secret': secretKey,
    },
    body: JSON.stringify(payload),
  });
}

export async function getPaymentHistory(): Promise<PaymentRecord[]> {
  return request<PaymentRecord[]>('/api/payments/history', {
    method: 'GET',
  });
}
