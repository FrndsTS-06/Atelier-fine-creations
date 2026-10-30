// Read public API base URL from VITE_API_BASE_URL with fallback
const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any).VITE_API_BASE_URL) ||
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000/api/v1';

export interface ApiClientOptions extends RequestInit {
  signal?: AbortSignal;
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  isOffline?: boolean;

  constructor(message: string, status?: number, code?: string, isOffline: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.isOffline = isOffline;
  }
}

/**
 * Central typed API client for AURÉLIEN / ATELIER FINE CREATIONS
 * Connects the React application to the Express REST API endpoints.
 */
export async function request<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('aurelien_auth_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Pre-check browser online status
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new ApiError(
      'Network connection unavailable. The atelier is operating in offline mode.',
      0,
      'OFFLINE',
      true
    );
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data: any;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        `Atelier API Error (${response.status}: ${response.statusText})`;
      const errorCode = data?.error?.code || 'API_ERROR';
      throw new ApiError(errorMessage, response.status, errorCode, false);
    }

    // Standard API response returns data inside { success: true, data: T }
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T;
    }

    return data as T;
  } catch (error: any) {
    // If request was intentionally aborted (e.g., superseding search stroke), bubble it up
    if (error.name === 'AbortError') {
      throw error;
    }

    if (error instanceof ApiError) {
      throw error;
    }

    // Network / server connection failure
    const isNetworkError =
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('fetch failed');

    if (isNetworkError) {
      throw new ApiError(
        'Unable to connect to the atelier catalog server. Please verify your connection or reattempt.',
        0,
        'SERVER_UNREACHABLE',
        true
      );
    }

    throw new ApiError(error.message || 'An unexpected atelier communication error occurred.');
  }
}
