import { useState } from 'react';
import { Clock, CalendarDays, Mail, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Frequency = 'daily' | 'weekly' | 'monthly';

interface Schedule {
  id: string;
  label: string;
  description: string;
  frequency: Frequency;
  enabled: boolean;
  icon: typeof Clock;
  lastRun: string | null;
}

const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'daily',
    label: 'Daily Scan',
    description: 'Scan inbox every day at 8:00 AM for new actionable emails.',
    frequency: 'daily',
    enabled: false,
    icon: Clock,
    lastRun: null,
  },
  {
    id: 'weekly',
    label: 'Weekly Scan',
    description: 'Scan inbox every Monday at 9:00 AM for accumulated disputes.',
    frequency: 'weekly',
    enabled: false,
    icon: CalendarDays,
    lastRun: null,
  },
  {
    id: 'monthly',
    label: 'Monthly Audit',
    description: 'Full inbox audit on the 1st of each month. Catches older missed claims.',
    frequency: 'monthly',
    enabled: false,
    icon: Mail,
    lastRun: null,
  },
];

const Automation = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);

  const toggleSchedule = (id: string) => {
    setSchedules(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const next = !s.enabled;
        toast.success(
          next
            ? `${s.label} enabled — your inbox will be scanned ${s.frequency}.`
            : `${s.label} disabled.`
        );
        return { ...s, enabled: next };
      })
    );
  };

  const enabledCount = schedules.filter(s => s.enabled).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Automation</h1>
        <p className="text-sm text-muted-foreground">
          Schedule automatic inbox scans to detect new disputes.
        </p>
      </div>

      {/* Status banner */}
      <div className={cn(
        'flex items-center gap-3 rounded-xl border p-4',
        enabledCount > 0
          ? 'border-primary/30 bg-primary/5'
          : 'border-border bg-card'
      )}>
        {enabledCount > 0 ? (
          <Power className="h-5 w-5 text-primary" />
        ) : (
          <PowerOff className="h-5 w-5 text-muted-foreground" />
        )}
        <p className="text-sm font-medium text-foreground">
          {enabledCount > 0
            ? `${enabledCount} automation${enabledCount > 1 ? 's' : ''} active`
            : 'No automations active — enable a schedule below.'}
        </p>
      </div>

      {/* Schedule cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {schedules.map(schedule => {
          const Icon = schedule.icon;
          return (
            <div
              key={schedule.id}
              className={cn(
                'rounded-xl border p-5 transition-colors',
                schedule.enabled
                  ? 'border-primary/30 bg-card'
                  : 'border-border bg-card'
              )}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  schedule.enabled ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <Icon className={cn(
                    'h-5 w-5',
                    schedule.enabled ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
                <Switch
                  checked={schedule.enabled}
                  onCheckedChange={() => toggleSchedule(schedule.id)}
                />
              </div>

              <h3 className="text-sm font-semibold text-foreground">{schedule.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {schedule.description}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {schedule.lastRun
                  ? `Last run: ${schedule.lastRun}`
                  : 'Never run yet'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">How it works</h3>
        <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <li className="flex gap-2">
            <span className="font-mono text-primary">1.</span>
            Enable a schedule above to set the scan frequency.
          </li>
          <li className="flex gap-2">
            <span className="font-mono text-primary">2.</span>
            At the scheduled time, your inbox is scanned for actionable emails (delays, overcharges, etc.).
          </li>
          <li className="flex gap-2">
            <span className="font-mono text-primary">3.</span>
            New disputes appear on your Dashboard with status <span className="font-mono text-foreground">SCANNED_MATCH</span> — nothing is submitted without your approval.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Automation;
