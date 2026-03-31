import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../models/user';

export type AuthModalMode = 'signin' | 'signup';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  showSignInModal: boolean;
  modalMode: AuthModalMode;
  openSignInModal: (mode?: AuthModalMode) => void;
  closeSignInModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [modalMode, setModalMode] = useState<AuthModalMode>('signin');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const signIn = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const openSignInModal = (mode: AuthModalMode = 'signin') => {
    setModalMode(mode);
    setShowSignInModal(true);
  };

  const closeSignInModal = () => {
    setShowSignInModal(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      signIn,
      signOut,
      showSignInModal,
      modalMode,
      openSignInModal,
      closeSignInModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
