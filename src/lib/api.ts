import type { Dispute, ApprovePayload, WebhookPayload, ScanResponse, ApiError } from '@/types/dispute';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

class ApiClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const error: ApiError = {
        message: body.message || body.error || `Request failed (${res.status})`,
        status: res.status,
      };
      throw error;
    }

    return res.json();
  }

  /** POST /api/v1/scan — triggers inbox scan */
  scan(): Promise<ScanResponse> {
    return this.request('/api/v1/scan', { method: 'POST' });
  }

  /** GET /api/v1/disputes — list all disputes */
  getDisputes(): Promise<Dispute[]> {
    return this.request('/api/v1/disputes');
  }

  /** GET /api/v1/disputes/:disputeId — single dispute */
  getDispute(disputeId: string): Promise<Dispute> {
    return this.request(`/api/v1/disputes/${disputeId}`);
  }

  /** POST /api/v1/disputes/:disputeId/approve — approve or reject */
  submitDecision(disputeId: string, payload: ApprovePayload): Promise<Dispute> {
    return this.request(`/api/v1/disputes/${disputeId}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /** POST /api/v1/webhooks/inbound-email — simulate vendor webhook */
  sendWebhook(payload: WebhookPayload): Promise<{ status: string }> {
    return this.request('/api/v1/webhooks/inbound-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiClient();