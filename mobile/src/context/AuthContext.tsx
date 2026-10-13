import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';

export type MobileRole = 'student' | 'faculty' | 'employee' | 'parking_staff' | 'guest' | null;

export interface MobileUser {
  id: string;
  name: string;
  email: string;
  role: MobileRole;
  idNum?: string;
  dept?: string;
}

const TOKEN_KEY = 'pass_auth_token';

/** Mirrors normalizeRole() in the web AuthContext. 'admin' is handled separately: the mobile app has no admin screens. */
function normalizeRole(role: string | null | undefined): MobileRole | 'admin' {
  switch (role?.toLowerCase()) {
    case 'admin':
    case 'administrator':
      return 'admin';
    case 'security':
    case 'parking':
    case 'parking_staff':
      return 'parking_staff';
    case 'student':
    case 'faculty':
    case 'employee':
    case 'guest':
      return role!.toLowerCase() as MobileRole;
    default:
      return null;
  }
}

function toUser(u: any): MobileUser {
  const role = normalizeRole(u.role);
  if (role === 'admin') {
    throw new Error('Administrator accounts use the PASS web dashboard. Please sign in on the web.');
  }
  if (!role) {
    throw new Error('Your account has no recognized PASS role. Please contact the administrator.');
  }
  return { id: String(u.id), name: u.name, email: u.email, role, idNum: u.idNum, dept: u.dept };
}

interface AuthCtx {
  user: MobileUser | null;
  token: string | null;
  restoring: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MobileUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);

  // Restore the session from the stored Sanctum token (same as GET /api/me in the web app).
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!stored) return;
        const data = await api<{ user: any }>('/me', { token: stored });
        setUser(toUser(data.user));
        setToken(stored);
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
      } finally {
        setRestoring(false);
      }
    })();
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const data = await api<{ token?: string; user?: any }>('/login', {
      json: { identifier: identifier.trim(), password },
    });
    if (!data.token || !data.user) throw new Error('The server returned an incomplete login response.');
    const u = toUser(data.user); // throws for admin/unknown roles before we store anything
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(u);
  }, []);

  // The original "Continue as Guest" button creates a local guest session (the API has no guest login).
  const continueAsGuest = useCallback(() => {
    setToken(null);
    setUser({ id: 'guest', name: 'Guest User', role: 'guest', email: 'guest@pass.edu' });
  }, []);

  const logout = useCallback(async () => {
    const t = token;
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    if (t) await api('/logout', { method: 'POST', token: t }).catch(() => {});
  }, [token]);

  return <Ctx.Provider value={{ user, token, restoring, login, continueAsGuest, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
}
