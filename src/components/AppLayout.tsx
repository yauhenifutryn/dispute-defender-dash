import AppSidebar from '@/components/AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-56">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;