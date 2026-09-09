import { ENDPOINTS, CLIENT_ID, setToken, authHeaders, getRefreshToken, setRefreshToken } from '../config/api';

export interface RegisterPayload {
  name: string;
  mail: string;
  password: string;
  field_fullname: string;
  field_phone_number: string;
  field_bio: string;
}

export interface LoginResult {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
  refreshToken?: string;
}

interface ApiErrorBody {
  error?: { code?: string; message?: string; details?: Record<string, string[]> };
}

// Drupal returns { error: { code, message, details } } on 4xx/5xx; surface
// `details` (per-field validation messages) alongside the top-level message
// so callers can map errors back onto the form.
export class ApiError extends Error {
  details?: Record<string, string[]>;
  constructor(message: string, details?: Record<string, string[]>) {
    super(message);
    this.details = details;
  }
}

export async function toApiError(res: Response): Promise<ApiError> {
  let body: ApiErrorBody = {};
  try { body = await res.json(); } catch { /* non-JSON error body */ }
  return new ApiError(body.error?.message || res.statusText || 'Request failed', body.error?.details);
}

export async function registerUser(payload: RegisterPayload): Promise<string> {
  const res = await fetch(ENDPOINTS.register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await toApiError(res);

  let body: { message?: string } = {};
  try { body = await res.json(); } catch { /* no JSON body */ }
  return body.message || 'Account created! Please sign in to continue.';
}

export async function loginUser(username: string, password: string): Promise<LoginResult> {
  const res = await fetch(ENDPOINTS.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password, client_id: CLIENT_ID }),
  });
  if (!res.ok) throw await toApiError(res);

  const data = await res.json();
  const token = data.data?.access_token;
  if (!token) throw new ApiError('Login succeeded but no access token was returned.');

  setToken(token);
  if (data.data.refresh_token) setRefreshToken(data.data.refresh_token);
  return {
    accessToken: token,
    tokenType: data.data.token_type ?? 'Bearer',
    expiresIn: data.data.expires_in,
    refreshToken: data.data.refresh_token,
  };
}

// Drupal's simple_oauth /oauth/token grant endpoint; takes form-encoded
// params (not JSON) and returns a fresh access token plus a rotated
// refresh token, which must both replace what's stored.
async function requestNewAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError('No refresh token available.');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const res = await fetch(ENDPOINTS.refreshToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
  });
  if (!res.ok) throw await toApiError(res);

  const data = await res.json();
  const token = data.access_token;
  if (!token) throw new ApiError('Token refresh succeeded but no access token was returned.');

  setToken(token);
  if (data.refresh_token) setRefreshToken(data.refresh_token);
  return token;
}

let pendingRefresh: Promise<string> | null = null;

// Single choke point for token refresh: callers that fire around the same
// time (profile page load, an edit's pre-save refresh) share one in-flight
// request instead of each issuing their own /oauth/token call.
export function refreshAccessToken(): Promise<string> {
  if (!pendingRefresh) {
    pendingRefresh = requestNewAccessToken().finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
}

export async function forgotPassword(mail: string): Promise<string> {
  const res = await fetch(ENDPOINTS.forgotPassword, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ mail }),
  });
  if (!res.ok) throw await toApiError(res);

  let body: { message?: string } = {};
  try { body = await res.json(); } catch { /* no JSON body */ }
  return body.message || 'If an account exists for that email, password reset instructions have been sent.';
}

export async function resetPassword(token: string, password: string): Promise<string> {
  const res = await fetch(ENDPOINTS.resetPassword, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) throw await toApiError(res);

  let body: { message?: string } = {};
  try { body = await res.json(); } catch { /* no JSON body */ }
  return body.message || 'Your password has been reset. Please sign in with your new password.';
}

export async function logoutUser(): Promise<void> {
  const res = await fetch(ENDPOINTS.logout, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...authHeaders() },
  });
  if (!res.ok) throw await toApiError(res);
}
