import { ENDPOINTS, fetchJson } from '../config/api';

export type SiteStats = { articles: number; tags: number; users: number };

let _cache: Promise<SiteStats> | null = null;

export function fetchStats(): Promise<SiteStats> {
  if (!_cache) {
    _cache = fetchJson<SiteStats>(ENDPOINTS.stats);
  }
  return _cache;
}
