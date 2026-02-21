import { useState, useEffect, useRef } from 'react';
import { Dispute, WebhookPayload } from '@/types/dispute';
import { Button } from '@/components/ui/button';
import { Zap, CheckCircle, XCircle, HelpCircle, Timer, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface WebhookSimulatorProps {
  dispute: Dispute;
  onResult: (result: 'accepted' | 'rejected' | 'needs_info') => void;
}

const WebhookSimulator = ({ dispute, onResult }: WebhookSimulatorProps) => {
  const [countdown, setCountdown] = useState(20);
  const [sending, setSending] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (dispute.status !== 'WAITING_VENDOR_RESPONSE') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setCountdown(20);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dispute.status]);

  if (dispute.status !== 'WAITING_VENDOR_RESPONSE') return null;

  const simulate = async (result: 'accepted' | 'rejected' | 'needs_info') => {
    setSending(result);
    const payload: WebhookPayload = {
      dispute_id: dispute.dispute_id ?? dispute.id,
      thread_id: `thread-${dispute.dispute_id ?? dispute.id}`,
      result,
      subject: `Re: Claim ${dispute.dispute_id ?? dispute.id}`,
      body_text: result === 'accepted'
        ? 'Your claim has been approved. Refund will be processed within 5-7 business days.'
        : result === 'rejected'
          ? 'After review, we are unable to approve your claim at this time.'
          : 'We need additional information to process your claim. Please provide further documentation.',
      source: 'simulation',
    };

    try {
      await api.sendWebhook(payload);
      toast.success(`Simulated: vendor ${result}`);
    } catch {
      toast.success(`Simulated locally: vendor ${result}`);
    }

    onResult(result);
    setSending(null);
  };

  const progress = ((20 - countdown) / 20) * 100;

  return (
    <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">🛠 Webhook Simulation</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Timer className="h-3.5 w-3.5" />
          <span className="font-mono">{countdown}s</span>
        </div>
      </div>

      {/* Countdown bar */}
      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => simulate('accepted')}
          disabled={!!sending}
          className="border-success/30 text-success hover:bg-success hover:text-success-foreground text-xs"
        >
          {sending === 'accepted' ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <CheckCircle className="mr-1 h-3 w-3" />}
          Accepted
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => simulate('rejected')}
          disabled={!!sending}
          className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs"
        >
          {sending === 'rejected' ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <XCircle className="mr-1 h-3 w-3" />}
          Rejected
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => simulate('needs_info')}
          disabled={!!sending}
          className="border-warning/30 text-warning hover:bg-warning hover:text-warning-foreground text-xs"
        >
          {sending === 'needs_info' ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <HelpCircle className="mr-1 h-3 w-3" />}
          Needs Info
        </Button>
      </div>
    </div>
  );
};

export default WebhookSimulator;