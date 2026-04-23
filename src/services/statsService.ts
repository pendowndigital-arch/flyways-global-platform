import { ENDPOINTS } from '../config/api';

export type SiteStats = { articles: number; tags: number; users: number };

let _cache: Promise<SiteStats> | null = null;

export function fetchStats(): Promise<SiteStats> {
  if (!_cache) {
    _cache = fetch(ENDPOINTS.stats).then((res) => res.json());
  }
  return _cache;
}
