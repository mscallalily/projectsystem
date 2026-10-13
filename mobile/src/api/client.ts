import { API_URL } from '../config';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  token?: string | null;
  json?: unknown;
  form?: FormData;
};

/** Flatten Laravel validation errors ({errors: {field: [msg]}}) into one readable message. */
function messageFrom(data: any, status: number): string {
  if (data?.errors && typeof data.errors === 'object') {
    const all = (Object.values(data.errors) as string[][]).flat();
    if (all.length) return all.join(' ');
  }
  return data?.message || `Request failed with status ${status}.`;
}

export async function api<T = any>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  let body: any;
  if (opts.form) body = opts.form; // let fetch set the multipart boundary
  else if (opts.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.json);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method: opts.method ?? (body ? 'POST' : 'GET'),
      headers,
      body,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      `Cannot reach the PASS server at ${API_URL}. Check your connection and EXPO_PUBLIC_API_URL.`,
      0,
    );
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(messageFrom(data, res.status), res.status);
  return data as T;
}
