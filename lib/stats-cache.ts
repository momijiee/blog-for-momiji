/**
 * Unified localStorage cache for per-slug blog stats.
 *
 * Schema:
 *   blog:stats:<slug>  →  SlugCache (JSON)
 *
 * TTL: 30 minutes after last DB fetch, reads come from cache only.
 * View dedup: only one view recorded per slug per calendar day (local date).
 */

export interface SlugCache {
  views: number;
  likes: number;
  hasLiked: boolean;
  /** Unix ms timestamp of the last successful DB read */
  lastFetchedAt: number;
  /** YYYY-MM-DD (local date) when a view was last recorded to DB */
  lastViewedDate: string;
}

/** Cache TTL in milliseconds (30 minutes) */
export const CACHE_TTL_MS = 30 * 60 * 1000;

const cacheKey = (slug: string) => `blog:stats:${slug}`;

/** Returns today's date as YYYY-MM-DD in the user's local timezone */
export function todayLocalDate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function readCache(slug: string): SlugCache | null {
  try {
    const raw = localStorage.getItem(cacheKey(slug));
    return raw ? (JSON.parse(raw) as SlugCache) : null;
  } catch {
    return null;
  }
}

export function writeCache(slug: string, data: SlugCache): void {
  try {
    localStorage.setItem(cacheKey(slug), JSON.stringify(data));
  } catch {
    // localStorage unavailable – silently ignore
  }
}

/** Returns true if the cached data is still within the TTL window */
export function isCacheFresh(cache: SlugCache): boolean {
  return Date.now() - cache.lastFetchedAt < CACHE_TTL_MS;
}

/** Returns true if a view has already been recorded today for this slug */
export function hasViewedToday(cache: SlugCache): boolean {
  return cache.lastViewedDate === todayLocalDate();
}
