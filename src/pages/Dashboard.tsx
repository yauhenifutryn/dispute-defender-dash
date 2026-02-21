import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, DollarSign, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dispute } from '@/types/dispute';
import { MOCK_DISPUTES, generateMockDispute } from '@/data/mockDisputes';
import { toast } from 'sonner';

const CATEGORY_LABELS: Record<string, string> = {
  flight_delay: 'Flight Delay',
  damaged_parcel: 'Damaged Parcel',
  late_delivery: 'Late Delivery',
  overcharge: 'Overcharge',
  cancellation: 'Cancellation',
};

const Dashboard = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const totalRecovered = disputes
    .filter(d => d.status === 'RESOLVED_SUCCESS')
    .reduce((sum, d) => sum + d.estimatedValue, 0);

  const activeCount = disputes.filter(d =>
    ['SCANNED_MATCH', 'AWAITING_USER_APPROVAL', 'WAITING_VENDOR_RESPONSE'].includes(d.status)
  ).length;

  const successRate = disputes.length > 0
    ? Math.round((disputes.filter(d => d.status === 'RESOLVED_SUCCESS').length / disputes.length) * 100)
    : 0;

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const newDispute = generateMockDispute();
      setDisputes(prev => [newDispute, ...prev]);
      setScanning(false);
      toast.success(`New dispute found! ${CATEGORY_LABELS[newDispute.category] || newDispute.category} claim against ${newDispute.vendorName} detected.`);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Disputes</h1>
          <p className="text-sm text-muted-foreground">Your autonomous claims, tracked end-to-end.</p>
        </div>
        <Button onClick={handleScan} disabled={scanning} size="lg" className="gap-2">
          <Radar className={scanning ? 'h-4 w-4 animate-radar-spin' : 'h-4 w-4'} />
          {scanning ? 'Scanning Inbox…' : 'Scan Inbox for Disputes'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Capital Recovered</p>
              <p className="text-2xl font-bold text-foreground">${totalRecovered.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Disputes</p>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold text-foreground">{successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Est. Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disputes.map(dispute => (
              <TableRow
                key={dispute.id}
                onClick={() => navigate(`/dispute/${dispute.id}`, { state: { disputes } })}
                className="cursor-pointer"
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{dispute.date}</TableCell>
                <TableCell className="font-medium text-foreground">{dispute.vendorName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{CATEGORY_LABELS[dispute.category] || dispute.category}</TableCell>
                <TableCell className="text-right font-mono font-semibold text-foreground">${dispute.estimatedValue}</TableCell>
                <TableCell><StatusBadge status={dispute.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
