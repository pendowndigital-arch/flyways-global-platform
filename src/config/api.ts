const BASE = import.meta.env.VITE_API_BASE_URL ?? '';
export const ASSETS_BASE = BASE.replace(/\/api$/, '');

export const ENDPOINTS = {
  categories: `${BASE}/categories?_format=json`,
  articles: `${BASE}/articles?_format=json`,
  articleDetail: (uid: string) => `${BASE}/article/${uid}`,
  stats: `${BASE}/stats?_format=json`,
  popularArticles: `${BASE}/popular_articles?_format=json`,
};

// Fetches `url` and parses it as JSON, throwing a `Response` (not a generic
// Error) on failure so React Router's error boundaries can report the real
// HTTP status instead of a raw JSON.parse SyntaxError.
export async function fetchJson<T>(url: string): Promise<T> {
  if (!BASE) {
    throw new Response(
      'API base URL is not configured (VITE_API_BASE_URL is missing).',
      { status: 503, statusText: 'Backend not configured' }
    );
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Response(`Request to ${url} failed`, {
      status: res.status,
      statusText: res.statusText,
    });
  }
  return res.json();
}
