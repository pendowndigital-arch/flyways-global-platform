import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Home, FileText, Mail, Info, ChevronDown, type LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems: { path: string; label: string; icon: LucideIcon }[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/articles', label: 'Articles', icon: FileText },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/contact', label: 'Contact Us', icon: Mail },
  { path: '/about', label: 'About Us', icon: Info },
];

interface TopNavProps {
  onSignInClick: () => void;
}

export function TopNav({ onSignInClick }: TopNavProps) {
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const avatar = (
    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
      {user?.fullName?.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 text-lg font-bold text-blue-700 tracking-tight transition-all duration-200 hover:text-indigo-600 hover:drop-shadow-sm">
            Flyways
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-500" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {avatar}
                  <span className="text-sm font-medium">{user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User size={16} />
                      My Profile
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={signOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={onSignInClick} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95">
                Sign In
              </button>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1 mb-3">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-100 pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {avatar}
                  <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
                </div>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-1 text-sm text-red-600">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={() => { onSignInClick(); setMobileOpen(false); }} className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
