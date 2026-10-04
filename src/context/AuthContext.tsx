import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'parking_admin' | 'security' | 'student' | 'faculty' | 'employee' | 'guest' | null;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  idNum?: string;
  dept?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; role: UserRole };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_ACCOUNTS: Record<string, AuthUser> = {
  'admin@pass.edu': { id: '0', name: 'System Administrator', email: 'admin@pass.edu', role: 'admin' },
  'parking@pass.edu': { id: '1', name: 'Parking Admin', email: 'parking@pass.edu', role: 'parking_admin' },
  'security@pass.edu': { id: '2', name: 'Liza Gonzales', email: 'security@pass.edu', role: 'security' },
  'student@pass.edu': { id: '3', name: 'Maria Santos', email: 'student@pass.edu', role: 'student', idNum: '2021-00123', dept: 'College of Engineering' },
  'faculty@pass.edu': { id: '4', name: 'Juan dela Cruz', email: 'faculty@pass.edu', role: 'faculty', idNum: '2019-00456', dept: 'College of Science' },
  'guest@pass.edu': { id: '5', name: 'John Smith', email: 'guest@pass.edu', role: 'guest' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string) => {
    const found = MOCK_ACCOUNTS[email.toLowerCase()];
    if (found) {
      setUser(found);
      return { success: true, role: found.role };
    }
    return { success: false, role: null };
  };

  const logout = () => setUser(null);

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
