const BASE = import.meta.env.VITE_API_BASE_URL ?? '';
export const ASSETS_BASE = BASE.replace(/\/api$/, '');

// OAuth client id for the login endpoint; same value for every environment.
export const CLIENT_ID = 'flywaysglobal_spa';

const TOKEN_KEY = 'flyways_access_token';
const REFRESH_TOKEN_KEY = 'flyways_refresh_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Merged into every authenticated request once a login has produced a token.
export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const ENDPOINTS = {
  categories: `${BASE}/categories?_format=json`,
  articles: `${BASE}/articles?_format=json`,
  articleDetail: (uid: string) => `${BASE}/article/${uid}`,
  stats: `${BASE}/stats?_format=json`,
  popularArticles: `${BASE}/popular_articles?_format=json`,
  register: `${BASE}/user/register`,
  login: `${BASE}/user/login`,
  forgotPassword: `${BASE}/user/password/forgot`,
  resetPassword: `${BASE}/user/password/reset`,
  activate: `${BASE}/user/activate`,
  logout: `${BASE}/user/logout`,
  me: `${BASE}/user/me`,
  refreshToken: `${ASSETS_BASE}/oauth/token`,
};

// Fetches `url` and parses it as JSON, throwing a `Response` (not a generic
// Error) on failure so React Router's error boundaries can report the real
// HTTP status instead of a raw JSON.parse SyntaxError.
export async function fetchJson<T>(url: string, options: { auth?: boolean } = {}): Promise<T> {
  if (!BASE) {
    throw new Response(
      'API base URL is not configured (VITE_API_BASE_URL is missing).',
      { status: 503, statusText: 'Backend not configured' }
    );
  }
  const { auth = true } = options;
  const res = await fetch(url, { headers: auth ? authHeaders() : {} });
  if (!res.ok) {
    throw new Response(`Request to ${url} failed`, {
      status: res.status,
      statusText: res.statusText,
    });
  }
  return res.json();
}
