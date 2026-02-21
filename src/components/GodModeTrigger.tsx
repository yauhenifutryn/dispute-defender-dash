import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface GodModeTriggerProps {
  disputeId: string;
  status: string;
  onSimulate: (disputeId: string) => void;
}

const GodModeTrigger = ({ disputeId, status, onSimulate }: GodModeTriggerProps) => {
  if (status !== 'WAITING_VENDOR_RESPONSE') return null;

  return (
    <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
      <p className="mb-2 font-mono text-xs text-muted-foreground">🛠 Developer Utility</p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSimulate(disputeId)}
        className="w-full border-primary/30 font-mono text-xs text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <Zap className="mr-1.5 h-3.5 w-3.5" />
        Simulate Vendor Reply (Demo)
      </Button>
    </div>
  );
};

export default GodModeTrigger;
