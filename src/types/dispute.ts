export type DisputeStatus =
  | 'SCANNED_MATCH'
  | 'AWAITING_USER_APPROVAL'
  | 'WAITING_VENDOR_RESPONSE'
  | 'RESOLVED_SUCCESS'
  | 'RESOLVED_REJECTED'
  | 'DISCARDED_BY_USER'
  | 'FAILED';

export type DisputeCategory = 'flight_delay' | 'damaged_parcel' | 'late_delivery' | 'overcharge' | 'cancellation';

export interface Dispute {
  id: string;
  date: string;
  vendorName: string;
  category: DisputeCategory;
  estimatedValue: number;
  status: DisputeStatus;
  flightNumber?: string;
  bookingRef?: string;
  emailSubject: string;
  emailBody: string;
  draftClaim?: string;
  computeCostUsd: number;
  valueGeneratedUsd: number;
  marginPct: number;
}

export interface DisputeEconomics {
  compute_cost_usd: number;
  value_generated_usd: number;
  margin_pct: number;
  fee_usd: number;
}
