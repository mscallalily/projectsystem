import { API_URL } from './config';
import { MobileUser, MobileRole } from './data/accounts';

let authToken: string | null = null;

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
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
      throw new ApiError(
        data.message ?? 'Something went wrong.',
        res.status,
        data.errors
      );
    }
    return data as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(
      __DEV__
        ? `Cannot reach the server (${String(e)}). URL: ${API_URL}${path}`
        : 'Cannot reach the server. Check your Wi-Fi and try again.',
      0
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Turns an error into a list of readable messages. */
export function errorMessages(e: unknown): string[] {
  if (e instanceof ApiError && e.errors) {
    return Object.values(e.errors).map((list) => list[0]);
  }
  return [e instanceof Error ? e.message : 'Something went wrong.'];
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

export type RegisterPayload = {
  full_name: string;
  user_code: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: string;
  department: string;
  contact_number: string;
  vehicle_type: string;
  plate_number: string;
  make?: string;
  model?: string;
  color?: string;
};

export async function register(payload: RegisterPayload): Promise<string> {
  const data = await request<{ message: string }>('/register', {
    method: 'POST',
    body: payload,
  });
  return data.message;
}

export const hasToken = () => authToken !== null;

export type ZoneRow = {
  id: number;
  code: string;
  name: string;
  capacity: number;
  occupied: number;
  reserved: number;
  unavailable: number;
  free: number;
};

export async function getParkingZones(): Promise<ZoneRow[]> {
  const data = await request<{ zones: ZoneRow[] }>('/parking/zones');
  return data.zones;
}