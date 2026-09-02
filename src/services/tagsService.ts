import { Tag, ApiCategory } from '../models/tag';
import { ENDPOINTS, ASSETS_BASE, fetchJson } from '../config/api';

let _cache: Promise<Tag[]> | null = null;

export function fetchTags(): Promise<Tag[]> {
  if (!_cache) {
    _cache = fetchJson<ApiCategory[]>(ENDPOINTS.categories, { auth: false })
      .then((data) =>
        data.map((c) => ({
          id: c.tid,
          name: c.name,
          priority: c.priority === '1' || c.priority === true,
          image: c.image ? `${ASSETS_BASE}${c.image}` : '',
        }))
      )
      .catch((err) => { _cache = null; throw err; });
  }
  return _cache;
}
