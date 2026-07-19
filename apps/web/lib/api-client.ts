import type { ApiResponse } from '@school/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const CSRF_COOKIE_NAME = 'educonnect_csrf';

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

let refreshPromise: Promise<boolean> | null = null;

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const prefix = `${encodeURIComponent(name)}=`;
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);
}

function requestHeaders(
  method: string,
  initialHeaders?: HeadersInit,
  body?: BodyInit | null,
): Headers {
  const headers = new Headers(initialHeaders);
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!headers.has('Content-Type') && !['GET', 'HEAD'].includes(method) && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = readCookie(CSRF_COOKIE_NAME);
    if (csrfToken) headers.set('x-csrf-token', decodeURIComponent(csrfToken));
  }
  return headers;
}

async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: requestHeaders('POST'),
      cache: 'no-store',
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | { message?: string | string[]; error?: { code?: string; details?: unknown } }
    | null;
  if (!response.ok) {
    const rawMessage = payload?.message;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join('. ')
      : (rawMessage ?? 'Không thể kết nối đến máy chủ');
    const errorPayload = payload && 'error' in payload ? payload.error : undefined;
    throw new ApiClientError(message, response.status, errorPayload?.code, errorPayload?.details);
  }
  return payload as ApiResponse<T>;
}

export async function apiRequestEnvelope<T>(
  path: string,
  init: RequestInit = {},
  allowRefresh = true,
): Promise<ApiResponse<T>> {
  const method = (init.method ?? 'GET').toUpperCase();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    method,
    credentials: 'include',
    headers: requestHeaders(method, init.headers, init.body),
    cache: 'no-store',
  });

  if (
    response.status === 401 &&
    allowRefresh &&
    path !== '/auth/login' &&
    path !== '/auth/refresh'
  ) {
    const refreshed = await refreshSession();
    if (refreshed) return apiRequestEnvelope<T>(path, init, false);
  }

  return parseResponse<T>(response);
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  allowRefresh = true,
): Promise<T> {
  return (await apiRequestEnvelope<T>(path, init, allowRefresh)).data;
}

export async function apiDownload(
  path: string,
  filename: string,
  allowRefresh = true,
): Promise<void> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: requestHeaders('GET'),
    cache: 'no-store',
  });
  if (response.status === 401 && allowRefresh && (await refreshSession())) {
    return apiDownload(path, filename, false);
  }
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new ApiClientError(payload?.message ?? 'Không thể tải file', response.status);
  }
  const url = URL.createObjectURL(await response.blob());
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
