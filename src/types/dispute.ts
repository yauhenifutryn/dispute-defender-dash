export type DisputeStatus =
  | 'SCANNED_MATCH'
  | 'AWAITING_USER_APPROVAL'
  | 'WAITING_VENDOR_RESPONSE'
  | 'RESOLVED_SUCCESS'
  | 'RESOLVED_REJECTED'
  | 'DISCARDED_BY_USER'
  | 'FAILED';

export type DisputeCategory = 'flight_delay' | 'damaged_parcel' | 'late_delivery' | 'overcharge' | 'cancellation';

export interface AgentRunStep {
  step_name: string;
  status: 'completed' | 'running' | 'failed' | 'pending';
  started_at?: string;
  completed_at?: string;
  output_json?: Record<string, unknown>;
}

export interface AgentRun {
  run_id: string;
  started_at: string;
  completed_at?: string;
  steps: AgentRunStep[];
}

export interface DisputeMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  channel: string;
  subject: string;
  body_text: string;
  created_at: string;
}

export interface Dispute {
  id: string;
  dispute_id?: string;
  date: string;
  updated_at: string;
  vendor_name: string;
  category: DisputeCategory;
  estimated_value: number;
  status: DisputeStatus;
  flight_number?: string;
  booking_ref?: string;
  email_subject: string;
  email_body: string;
  draft_claim?: string;
  draft_payload?: Record<string, unknown>;
  messages?: DisputeMessage[];
  agent_runs?: AgentRun[];
}

export interface DisputeEconomics {
  compute_cost_usd: number;
  value_generated_usd: number;
  margin_pct: number;
}

export interface ApprovePayload {
  decision: 'APPROVE' | 'REJECT';
  channel?: string;
  note?: string;
}

export interface WebhookPayload {
  dispute_id: string;
  thread_id: string;
  result: 'accepted' | 'rejected' | 'needs_info';
  subject: string;
  body_text: string;
  source: string;
}

export interface ScanResponse {
  status: string;
  disputes_found?: number;
}

export interface ApiError {
  message: string;
  status?: number;
}