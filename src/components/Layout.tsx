import { TopNav } from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export function Layout({ children, rightPanel }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30">
      {/* accent bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-50" />
      <TopNav onSignInClick={() => {}} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <main className={rightPanel ? 'lg:col-span-8' : 'lg:col-span-12'}>
              {children}
            </main>
            {rightPanel && (
              <aside className="lg:col-span-4">{rightPanel}</aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
