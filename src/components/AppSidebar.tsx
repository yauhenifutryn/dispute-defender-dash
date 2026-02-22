import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppSidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-sm font-bold tracking-tight text-sidebar-primary-foreground">
          ClearClaim
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {[
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ].map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
             pathname === to || pathname.startsWith(to + '/')
               ? 'bg-sidebar-accent text-sidebar-primary'
               : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/50">ClearClaim · Capital Recovery</p>
      </div>
    </aside>
  );
};

export default AppSidebar;