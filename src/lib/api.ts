import { supabase } from '@/integrations/supabase/client';
import type { Dispute, DisputeRow, MessageRow, AgentRunRow, ApprovePayload, WebhookPayload, ScanResponse, ApiError, DisputeStatus } from '@/types/dispute';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ─── Helpers ────────────────────────────────────────────────

function rowToDispute(row: DisputeRow, messages?: MessageRow[], agentRuns?: AgentRunRow[]): Dispute {
  return {
    dispute_id: row.dispute_id,
    id: row.dispute_id, // legacy alias
    user_id: row.user_id,
    category: row.category ?? 'unknown',
    status: (row.status ?? 'SCANNED_MATCH') as DisputeStatus,
    vendor_name: row.vendor_name ?? 'Unknown Vendor',
    policy_region: row.policy_region,
    draft_payload_json: row.draft_payload_json as Record<string, unknown> | null,
    latest_reason: row.latest_reason,
    created_at: row.created_at,
    updated_at: row.updated_at,
    messages: messages ?? [],
    agent_runs: agentRuns ?? [],
  };
}

// ─── Supabase read-only queries ─────────────────────────────

async function fetchDisputesFromSupabase(): Promise<Dispute[]> {
  const { data: rows, error } = await supabase
    .from('disputes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  if (!rows || rows.length === 0) return [];

  return rows.map((r) => rowToDispute(r as unknown as DisputeRow));
}

async function fetchDisputeFromSupabase(disputeId: string): Promise<Dispute | null> {
  const { data: row, error } = await supabase
    .from('disputes')
    .select('*')
    .eq('dispute_id', disputeId)
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;

  // Fetch related messages & agent_runs in parallel
  const [msgRes, runRes] = await Promise.all([
    supabase.from('messages').select('*').eq('dispute_id', disputeId).order('created_at', { ascending: true }),
    supabase.from('agent_runs').select('*').eq('dispute_id', disputeId).order('created_at', { ascending: true }),
  ]);

  return rowToDispute(
    row as unknown as DisputeRow,
    (msgRes.data ?? []) as unknown as MessageRow[],
    (runRes.data ?? []) as unknown as AgentRunRow[],
  );
}

// ─── HTTP client for mutations (external backend) ───────────

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

  /** Read disputes from Supabase (primary), fallback to HTTP */
  async getDisputes(): Promise<Dispute[]> {
    try {
      return await fetchDisputesFromSupabase();
    } catch {
      // fallback to HTTP if Supabase fails
      return this.request('/api/v1/disputes');
    }
  }

  /** Read single dispute from Supabase (primary), fallback to HTTP */
  async getDispute(disputeId: string): Promise<Dispute> {
    try {
      const d = await fetchDisputeFromSupabase(disputeId);
      if (d) return d;
      throw new Error('not found');
    } catch {
      return this.request(`/api/v1/disputes/${disputeId}`);
    }
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
