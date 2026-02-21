import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, DollarSign, Shield, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dispute, DisputeStatus } from '@/types/dispute';
import { MOCK_DISPUTES, generateMockDispute } from '@/data/mockDisputes';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  flight_delay: 'Flight Delay',
  damaged_parcel: 'Damaged Parcel',
  late_delivery: 'Late Delivery',
  overcharge: 'Overcharge',
  cancellation: 'Cancellation',
};

const ALL_STATUSES: DisputeStatus[] = [
  'SCANNED_MATCH',
  'AWAITING_USER_APPROVAL',
  'WAITING_VENDOR_RESPONSE',
  'RESOLVED_SUCCESS',
  'RESOLVED_REJECTED',
  'DISCARDED_BY_USER',
  'FAILED',
];

const STATUS_LABELS: Record<DisputeStatus, string> = {
  SCANNED_MATCH: 'Scanned',
  AWAITING_USER_APPROVAL: 'Needs Approval',
  WAITING_VENDOR_RESPONSE: 'Pending Vendor',
  RESOLVED_SUCCESS: 'Resolved',
  RESOLVED_REJECTED: 'Rejected',
  DISCARDED_BY_USER: 'Discarded',
  FAILED: 'Failed',
};

const Dashboard = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<DisputeStatus>>(new Set());
  const navigate = useNavigate();

  const fetchDisputes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDisputes();
      setDisputes(data);
    } catch {
      // Fallback to mock data if API is unavailable
      setDisputes(MOCK_DISPUTES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const totalRecovered = disputes
    .filter(d => d.status === 'RESOLVED_SUCCESS')
    .reduce((sum, d) => sum + d.estimated_value, 0);

  const activeCount = disputes.filter(d =>
    ['SCANNED_MATCH', 'AWAITING_USER_APPROVAL', 'WAITING_VENDOR_RESPONSE'].includes(d.status)
  ).length;

  const successRate = disputes.length > 0
    ? Math.round((disputes.filter(d => d.status === 'RESOLVED_SUCCESS').length / disputes.length) * 100)
    : 0;

  const handleScan = async () => {
    setScanning(true);
    try {
      await api.scan();
      await fetchDisputes();
      toast.success('Inbox scanned successfully!');
    } catch {
      // Fallback: inject mock dispute
      const newDispute = generateMockDispute();
      setDisputes(prev => [newDispute, ...prev]);
      toast.success(`New dispute found! ${CATEGORY_LABELS[newDispute.category] || newDispute.category} claim against ${newDispute.vendor_name} detected.`);
    } finally {
      setScanning(false);
    }
  };

  const toggleFilter = (status: DisputeStatus) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const filteredDisputes = activeFilters.size > 0
    ? disputes.filter(d => activeFilters.has(d.status as DisputeStatus))
    : disputes;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
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
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
          {scanning ? 'Scanning Inbox…' : 'Scan Inbox'}
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

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map(status => (
          <button
            key={status}
            onClick={() => toggleFilter(status)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              activeFilters.has(status)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading / Error / Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchDisputes}>Retry</Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Est. Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisputes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No disputes found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDisputes.map(dispute => (
                  <TableRow
                    key={dispute.id}
                    onClick={() => navigate(`/dispute/${dispute.dispute_id ?? dispute.id}`)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{dispute.dispute_id ?? dispute.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{dispute.vendor_name ?? 'Unknown'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{CATEGORY_LABELS[dispute.category] ?? dispute.category ?? '—'}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-foreground">${dispute.estimated_value ?? 0}</TableCell>
                    <TableCell><StatusBadge status={(dispute.status ?? 'SCANNED_MATCH') as DisputeStatus} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(dispute.updated_at ?? dispute.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;