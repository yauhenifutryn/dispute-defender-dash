import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap } from 'lucide-react';

const AppSidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-sm font-bold tracking-tight text-sidebar-primary-foreground">
          Bureaucracy Hacker
        </span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5 text-sm font-medium text-sidebar-primary"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/50">Inbox-to-Claim MVP</p>
      </div>
    </aside>
  );
};

export default AppSidebar;