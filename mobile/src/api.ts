import { API_URL } from './config';
import { MobileUser, MobileRole } from './data/accounts';

let authToken: string | null = null;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(data.message ?? 'Something went wrong.', res.status);
    }
    return data as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(
      'Cannot reach the server. Check your Wi-Fi and that the API is running.',
      0
    );
  } finally {
    clearTimeout(timer);
  }
}

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: string | null;
};

// Backend role codes -> the roles the mobile app knows about
const ROLE_MAP: Record<string, MobileRole> = {
  admin: 'parking_admin',
  parking_admin: 'parking_admin',
  security: 'security',
  student: 'student',
  faculty: 'faculty',
  employee: 'employee',
};

function toMobileUser(u: ApiUser): MobileUser {
  return {
    name: u.name || u.email,
    email: u.email,
    role: (u.role && ROLE_MAP[u.role]) || 'guest',
  };
}

export async function login(
  identifier: string,
  password: string
): Promise<MobileUser> {
  const data = await request<{ token: string; user: ApiUser }>('/login', {
    method: 'POST',
    body: { identifier, password },
  });
  authToken = data.token;
  return toMobileUser(data.user);
}

export async function logout(): Promise<void> {
  try {
    await request('/logout', { method: 'POST' });
  } catch {
    // Even if the server can't be reached, sign the user out locally.
  }
  authToken = null;
}