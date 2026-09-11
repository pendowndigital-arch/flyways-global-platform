import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../models/user';
import { getCurrentUser, updateProfile as updateProfileApi } from '../services/userService';
import { logoutUser } from '../services/authService';
import { getToken, clearToken, clearRefreshToken } from '../config/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (user: User) => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: { bio: string; phoneNumber: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Paint the cached profile immediately, then reconcile with the server.
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }

    if (!getToken()) return;
    getCurrentUser()
      .then(fresh => {
        setUser(fresh);
        localStorage.setItem('user', JSON.stringify(fresh));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('user');
        clearToken();
        clearRefreshToken();
      });
  }, []);

  const signIn = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signOut = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Failed to notify server of logout:', error);
    }
    setUser(null);
    localStorage.removeItem('user');
    clearToken();
    clearRefreshToken();
  };

  const updateProfile = async (updates: { bio: string; phoneNumber: string }) => {
    const result = await updateProfileApi(updates);
    setUser(result);
    localStorage.setItem('user', JSON.stringify(result));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      signIn,
      signOut,
      updateProfile,
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
