import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Disputes', path: '/', icon: Shield },
  { label: 'Settings', path: '#', icon: Settings },
];

const AppSidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-sm font-bold tracking-tight text-sidebar-primary-foreground">
          Bureaucracy Hacker
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path && item.label !== 'Settings';
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/50">Powered by Paid.ai</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
