import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, setToken, clearToken, getToken, ApiError } from '../lib/api';

export type UserRole = 'admin' | 'parking_admin' | 'security' | 'student' | 'faculty' | 'employee' | 'guest' | null;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  idNum?: string;
  dept?: string;
}

export interface LoginResult {
  success: boolean;
  role: UserRole;
  message?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// TEMPORARY: guests are not in the users table. This mock keeps GuestDashboardPage
// working until the visitor module is built. Remove it in the visitor phase.
const MOCK_GUEST: AuthUser = { id: 'guest-demo', name: 'John Smith', email: 'guest@pass.edu', role: 'guest' };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // If a token is saved, wait for /me before deciding whether the user is logged in.
  const [loading, setLoading] = useState<boolean>(!!getToken());

  useEffect(() => {
    if (!getToken()) return;
    api<{ user: AuthUser }>('/me')
      .then(res => setUser(res.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier: string, password: string): Promise<LoginResult> => {
    if (identifier.trim().toLowerCase() === MOCK_GUEST.email) {
      setUser(MOCK_GUEST);
      return { success: true, role: 'guest' };
    }
    try {
      const res = await api<{ token: string; user: AuthUser }>('/login', {
        method: 'POST',
        body: { identifier: identifier.trim(), password },
      });
      setToken(res.token);
      setUser(res.user);
      return { success: true, role: res.user.role };
    } catch (e) {
      const message = e instanceof ApiError ? e.message : 'Something went wrong. Please try again.';
      return { success: false, role: null, message };
    }
  };

  const logout = () => {
    if (getToken()) api('/logout', { method: 'POST' }).catch(() => {});
    clearToken();
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}