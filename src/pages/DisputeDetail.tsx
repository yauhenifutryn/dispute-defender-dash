import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Plane, Package, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import EconomicsWidget from '@/components/EconomicsWidget';
import AgentTimeline from '@/components/AgentTimeline';
import HITLActionBlock from '@/components/HITLActionBlock';
import GodModeTrigger from '@/components/GodModeTrigger';
import { Dispute } from '@/types/dispute';
import { MOCK_DISPUTES } from '@/data/mockDisputes';
import { useState } from 'react';
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
  const location = useLocation();
  const navigate = useNavigate();

  const passedDisputes = (location.state as { disputes?: Dispute[] })?.disputes;
  const sourceList = passedDisputes || MOCK_DISPUTES;
  const found = sourceList.find(d => d.id === id);

  const [dispute, setDispute] = useState<Dispute | null>(found || null);

  if (!dispute) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Dispute not found.</p>
      </div>
    );
  }

  const handleDecision = (_id: string, decision: 'APPROVE' | 'REJECT') => {
    const newStatus = decision === 'APPROVE' ? 'WAITING_VENDOR_RESPONSE' : 'DISCARDED_BY_USER' as const;
    setDispute(prev => prev ? { ...prev, status: newStatus } : prev);
    toast.success(decision === 'APPROVE' ? 'Claim approved and submitted to vendor!' : 'Draft rejected and discarded.');
  };

  const handleSimulate = () => {
    setDispute(prev => prev ? { ...prev, status: 'RESOLVED_SUCCESS' } : prev);
    toast.success('🎉 Vendor accepted the claim! Dispute resolved successfully.');
  };

  const economics = {
    compute_cost_usd: dispute.computeCostUsd,
    value_generated_usd: dispute.valueGeneratedUsd,
    margin_pct: dispute.marginPct,
    fee_usd: dispute.valueGeneratedUsd * 0.25,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{dispute.vendorName}</h1>
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
                <p className="text-sm font-medium text-foreground">{dispute.emailSubject}</p>
              </div>
            </div>
            {dispute.flightNumber && (
              <div className="flex items-start gap-3">
                <Plane className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Flight Number</p>
                  <p className="text-sm font-medium text-foreground">{dispute.flightNumber}</p>
                </div>
              </div>
            )}
            {dispute.bookingRef && (
              <div className="flex items-start gap-3">
                <Hash className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Reference</p>
                  <p className="text-sm font-mono text-foreground">{dispute.bookingRef}</p>
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
              <p className="mt-1 text-xs leading-relaxed text-foreground/80">{dispute.emailBody}</p>
            </div>
          </div>
        </div>

        {/* Center: Timeline + HITL + God Mode */}
        <div className="space-y-6">
          <AgentTimeline status={dispute.status} />
          <HITLActionBlock dispute={dispute} onDecision={handleDecision} />
          <GodModeTrigger disputeId={dispute.id} status={dispute.status} onSimulate={handleSimulate} />
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
