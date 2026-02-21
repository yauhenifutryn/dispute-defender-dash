import { Dispute, DisputeCategory } from '@/types/dispute';

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp-001',
    dispute_id: 'disp-001',
    date: '2026-02-18',
    updated_at: '2026-02-18T14:30:00Z',
    vendor_name: 'Ryanair',
    category: 'flight_delay',
    estimated_value: 250,
    status: 'AWAITING_USER_APPROVAL',
    flight_number: 'FR4821',
    booking_ref: 'RYN-8834X',
    email_subject: 'Your Ryanair flight FR4821 was delayed 4h 23m',
    email_body: 'Dear passenger, we regret to inform you that flight FR4821 from Dublin to Barcelona on 15 Feb 2026 experienced a delay of 4 hours and 23 minutes due to operational reasons.',
    draft_claim: 'Dear Ryanair Customer Relations,\n\nI am writing to claim compensation under EU Regulation 261/2004 for flight FR4821 (Dublin → Barcelona) on 15 February 2026, which was delayed by 4 hours and 23 minutes.\n\nUnder the regulation, I am entitled to €250 compensation for this delay on a flight of this distance.\n\nBooking reference: RYN-8834X\n\nPlease process this claim within 14 days.\n\nRegards',
    draft_payload: {
      regulation: 'EU261/2004',
      flight: 'FR4821',
      route: 'DUB-BCN',
      delay_hours: 4.38,
      compensation_eur: 250,
      booking_ref: 'RYN-8834X',
    },
    messages: [
      { id: 'msg-001', direction: 'inbound', channel: 'email', subject: 'Flight FR4821 delay notification', body_text: 'Your flight was delayed by 4h 23m.', created_at: '2026-02-15T10:00:00Z' },
    ],
    agent_runs: [
      {
        run_id: 'run-001',
        started_at: '2026-02-18T14:00:00Z',
        steps: [
          { step_name: 'email_scan', status: 'completed', output_json: { emails_found: 1 } },
          { step_name: 'entity_extraction', status: 'completed', output_json: { vendor: 'Ryanair', flight: 'FR4821' } },
          { step_name: 'draft_generation', status: 'completed', output_json: { draft_length: 312 } },
          { step_name: 'billing_stub', status: 'completed', output_json: { compute_cost_usd: 0.15, value_generated_usd: 250, margin_pct: 99.9 } },
        ],
      },
    ],
  },
  {
    id: 'disp-002',
    dispute_id: 'disp-002',
    date: '2026-02-16',
    updated_at: '2026-02-17T09:00:00Z',
    vendor_name: 'DHL',
    category: 'damaged_parcel',
    estimated_value: 85,
    status: 'WAITING_VENDOR_RESPONSE',
    booking_ref: 'DHL-99281',
    email_subject: 'DHL Delivery Confirmation - Package damaged on arrival',
    email_body: 'Your package (tracking: DHL-99281) was delivered on 14 Feb 2026. The recipient has reported damage to the contents.',
    draft_claim: 'Dear DHL Claims Department,\n\nI am filing a damage claim for parcel DHL-99281, delivered on 14 February 2026. The contents were visibly damaged upon receipt.\n\nEstimated value of damaged goods: $85.00\n\nPhotographic evidence is attached.\n\nPlease advise on next steps.',
    draft_payload: { tracking: 'DHL-99281', damage_value_usd: 85 },
    messages: [
      { id: 'msg-002', direction: 'inbound', channel: 'email', subject: 'Delivery confirmation', body_text: 'Package delivered, damage reported.', created_at: '2026-02-14T16:00:00Z' },
      { id: 'msg-003', direction: 'outbound', channel: 'email', subject: 'Damage claim DHL-99281', body_text: 'Filing claim for damaged parcel.', created_at: '2026-02-16T10:00:00Z' },
    ],
    agent_runs: [
      {
        run_id: 'run-002',
        started_at: '2026-02-16T09:30:00Z',
        steps: [
          { step_name: 'email_scan', status: 'completed' },
          { step_name: 'entity_extraction', status: 'completed' },
          { step_name: 'draft_generation', status: 'completed' },
          { step_name: 'billing_stub', status: 'completed', output_json: { compute_cost_usd: 0.12, value_generated_usd: 85, margin_pct: 99.9 } },
          { step_name: 'submission', status: 'completed' },
        ],
      },
    ],
  },
  {
    id: 'disp-003',
    dispute_id: 'disp-003',
    date: '2026-02-14',
    updated_at: '2026-02-15T12:00:00Z',
    vendor_name: 'Amazon',
    category: 'late_delivery',
    estimated_value: 30,
    status: 'RESOLVED_SUCCESS',
    booking_ref: 'AMZ-114-2938',
    email_subject: 'Your Amazon Prime delivery was late',
    email_body: 'Your guaranteed delivery for order AMZ-114-2938 was missed. The package arrived 3 days late.',
    agent_runs: [
      {
        run_id: 'run-003',
        started_at: '2026-02-14T08:00:00Z',
        completed_at: '2026-02-15T12:00:00Z',
        steps: [
          { step_name: 'email_scan', status: 'completed' },
          { step_name: 'billing_stub', status: 'completed', output_json: { compute_cost_usd: 0.08, value_generated_usd: 30, margin_pct: 99.7 } },
        ],
      },
    ],
  },
  {
    id: 'disp-004',
    dispute_id: 'disp-004',
    date: '2026-02-12',
    updated_at: '2026-02-13T16:00:00Z',
    vendor_name: 'EasyJet',
    category: 'cancellation',
    estimated_value: 180,
    status: 'RESOLVED_REJECTED',
    flight_number: 'U2-4417',
    booking_ref: 'EZJ-77120',
    email_subject: 'EasyJet flight U2-4417 cancellation notice',
    email_body: 'We regret to inform you that flight U2-4417 from London Gatwick to Nice on 10 Feb 2026 has been cancelled.',
    agent_runs: [
      {
        run_id: 'run-004',
        started_at: '2026-02-12T10:00:00Z',
        steps: [
          { step_name: 'email_scan', status: 'completed' },
          { step_name: 'billing_stub', status: 'completed', output_json: { compute_cost_usd: 0.18, value_generated_usd: 0, margin_pct: 0 } },
        ],
      },
    ],
  },
  {
    id: 'disp-005',
    dispute_id: 'disp-005',
    date: '2026-02-10',
    updated_at: '2026-02-10T08:00:00Z',
    vendor_name: 'FedEx',
    category: 'damaged_parcel',
    estimated_value: 120,
    status: 'DISCARDED_BY_USER',
    booking_ref: 'FDX-55102',
    email_subject: 'FedEx shipment FDX-55102 damage report',
    email_body: 'A damage report has been filed for shipment FDX-55102.',
    agent_runs: [],
  },
  {
    id: 'disp-006',
    dispute_id: 'disp-006',
    date: '2026-02-08',
    updated_at: '2026-02-09T11:00:00Z',
    vendor_name: 'Lufthansa',
    category: 'flight_delay',
    estimated_value: 400,
    status: 'FAILED',
    flight_number: 'LH-1823',
    booking_ref: 'LH-MUC-9912',
    email_subject: 'Lufthansa flight LH-1823 delay compensation denied',
    email_body: 'Your compensation claim for flight LH-1823 has been reviewed. Unfortunately, the delay was caused by extraordinary circumstances beyond our control.',
    agent_runs: [
      {
        run_id: 'run-006',
        started_at: '2026-02-08T07:00:00Z',
        steps: [
          { step_name: 'email_scan', status: 'completed' },
          { step_name: 'billing_stub', status: 'completed', output_json: { compute_cost_usd: 0.22, value_generated_usd: 0, margin_pct: 0 } },
        ],
      },
    ],
  },
];

const VENDOR_POOL = [
  { name: 'Ryanair', categories: ['flight_delay', 'cancellation'] as DisputeCategory[] },
  { name: 'DHL', categories: ['damaged_parcel', 'late_delivery'] as DisputeCategory[] },
  { name: 'Amazon', categories: ['late_delivery', 'overcharge'] as DisputeCategory[] },
  { name: 'EasyJet', categories: ['flight_delay', 'cancellation'] as DisputeCategory[] },
  { name: 'FedEx', categories: ['damaged_parcel', 'late_delivery'] as DisputeCategory[] },
  { name: 'Hermes', categories: ['damaged_parcel', 'late_delivery'] as DisputeCategory[] },
];

export function generateMockDispute(): Dispute {
  const vendor = VENDOR_POOL[Math.floor(Math.random() * VENDOR_POOL.length)];
  const category = vendor.categories[Math.floor(Math.random() * vendor.categories.length)];
  const estimatedValue = Math.floor(Math.random() * 220) + 30;
  const id = `disp-${Date.now().toString(36)}`;

  return {
    id,
    dispute_id: id,
    date: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString(),
    vendor_name: vendor.name,
    category,
    estimated_value: estimatedValue,
    status: 'SCANNED_MATCH',
    email_subject: `New ${category.replace('_', ' ')} claim detected — ${vendor.name}`,
    email_body: `An automated scan of your inbox detected a potential ${category.replace('_', ' ')} dispute with ${vendor.name}. Estimated recoverable value: $${estimatedValue}.`,
    agent_runs: [
      {
        run_id: `run-${id}`,
        started_at: new Date().toISOString(),
        steps: [
          { step_name: 'email_scan', status: 'completed', output_json: { emails_found: 1 } },
          { step_name: 'billing_stub', status: 'completed', output_json: { compute_cost_usd: 0.15, value_generated_usd: estimatedValue, margin_pct: 99.8 } },
        ],
      },
    ],
  };
}