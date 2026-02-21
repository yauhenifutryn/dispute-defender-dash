import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Plane, Hash, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import EconomicsWidget from '@/components/EconomicsWidget';
import AgentTimeline from '@/components/AgentTimeline';
import HITLActionBlock from '@/components/HITLActionBlock';
import WebhookSimulator from '@/components/WebhookSimulator';
import DraftPayloadViewer from '@/components/DraftPayloadViewer';
import { Dispute, DisputeEconomics } from '@/types/dispute';
import { MOCK_DISPUTES } from '@/data/mockDisputes';
import { api } from '@/lib/api';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const CATEGORY_LABELS: Record<string, string> = {
  flight_delay: 'Flight Delay',
  damaged_parcel: 'Damaged Parcel',
  late_delivery: 'Late Delivery',
  overcharge: 'Overcharge',
  cancellation: 'Cancellation',
};

const DisputeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDispute = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDispute(id);
      setDispute(data);
    } catch {
      // Fallback to mock
      const found = MOCK_DISPUTES.find(d => d.id === id);
      if (found) {
        setDispute(found);
      } else {
        setError('Dispute not found.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDispute();
  }, [fetchDispute]);

  const handleDecision = async (decision: 'APPROVE' | 'REJECT', note?: string) => {
    if (!dispute) return;
    setSubmitting(true);
    try {
      const payload = decision === 'APPROVE'
        ? { decision: 'APPROVE' as const, channel: 'PORTAL' }
        : { decision: 'REJECT' as const, note: note || 'User rejected draft' };
      const updated = await api.submitDecision(dispute.id, payload);
      setDispute(updated);
      toast.success(decision === 'APPROVE' ? 'Claim approved and submitted!' : 'Draft rejected.');
    } catch {
      // Fallback: update locally
      const newStatus = decision === 'APPROVE' ? 'WAITING_VENDOR_RESPONSE' : 'DISCARDED_BY_USER' as const;
      setDispute(prev => prev ? { ...prev, status: newStatus } : prev);
      toast.success(decision === 'APPROVE' ? 'Claim approved and submitted!' : 'Draft rejected.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWebhookResult = (result: 'accepted' | 'rejected' | 'needs_info') => {
    const statusMap = {
      accepted: 'RESOLVED_SUCCESS' as const,
      rejected: 'RESOLVED_REJECTED' as const,
      needs_info: 'AWAITING_USER_APPROVAL' as const,
    };
    setDispute(prev => prev ? { ...prev, status: statusMap[result] } : prev);
  };

  // Extract economics from agent_runs billing_stub
  const extractEconomics = (): DisputeEconomics | null => {
    if (!dispute?.agent_runs?.length) return null;
    for (const run of dispute.agent_runs) {
      for (const step of run.steps) {
        if (step.step_name === 'billing_stub' && step.output_json) {
          const o = step.output_json;
          if (typeof o.compute_cost_usd === 'number' && typeof o.value_generated_usd === 'number') {
            return {
              compute_cost_usd: o.compute_cost_usd,
              value_generated_usd: o.value_generated_usd,
              margin_pct: typeof o.margin_pct === 'number' ? o.margin_pct : 0,
            };
          }
        }
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error || 'Dispute not found.'}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>Back</Button>
      </div>
    );
  }

  const economics = extractEconomics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{dispute.vendor_name}</h1>
            <StatusBadge status={dispute.status} />
          </div>
          <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[dispute.category]} · {dispute.date}</p>
        </div>
      </div>

      {/* Split Pane */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Context */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Original Context</h3>
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Subject</p>
                <p className="text-sm font-medium text-foreground">{dispute.email_subject}</p>
              </div>
            </div>
            {dispute.flight_number && (
              <div className="flex items-start gap-3">
                <Plane className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Flight Number</p>
                  <p className="text-sm font-medium text-foreground">{dispute.flight_number}</p>
                </div>
              </div>
            )}
            {dispute.booking_ref && (
              <div className="flex items-start gap-3">
                <Hash className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Reference</p>
                  <p className="text-sm font-mono text-foreground">{dispute.booking_ref}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground">{dispute.date}</p>
              </div>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">Email excerpt</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground/80">{dispute.email_body}</p>
            </div>
          </div>

          {/* Messages */}
          {dispute.messages && dispute.messages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Messages</h3>
              {dispute.messages.map(msg => (
                <div key={msg.id} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${msg.direction === 'outbound' ? 'text-primary' : 'text-muted-foreground'}`}>
                      {msg.direction === 'outbound' ? '→ Sent' : '← Received'}
                    </span>
                    <span className="text-xs text-muted-foreground">{msg.channel}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{msg.subject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{msg.body_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center: Timeline + HITL + Webhook Sim */}
        <div className="space-y-6">
          <AgentTimeline status={dispute.status} />
          <HITLActionBlock dispute={dispute} onDecision={handleDecision} submitting={submitting} />
          <DraftPayloadViewer payload={dispute.draft_payload} />
          <WebhookSimulator dispute={dispute} onResult={handleWebhookResult} />
        </div>

        {/* Right: Economics */}
        <div className="space-y-4">
          <EconomicsWidget economics={economics} />
        </div>
      </div>
    </div>
  );
};

export default DisputeDetail;