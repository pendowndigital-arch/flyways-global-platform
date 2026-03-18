import { TopNav } from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export function Layout({ children, rightPanel }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
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
