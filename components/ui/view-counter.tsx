'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import {
  readCache,
  writeCache,
  hasViewedToday,
  todayUtcDate,
  type SlugCache,
} from '@/lib/stats-cache';

interface ViewCounterProps {
  slug: string;
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const cached = readCache(slug);

    // 1. Immediately show cached views to avoid "..." flash
    if (cached !== null) {
      setViews(cached.views);
    }

    // 2. Decide whether to hit the DB
    const needsViewRecord = !cached || !hasViewedToday(cached);
    // Always revalidate so a cached count cannot hide a backend outage.

    if (needsViewRecord) {
      // First visit of the day: optimistically increment, then record + fetch
      if (cached !== null) {
        setViews(cached.views + 1);
      }

      fetch(`/api/action/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'view' }),
      })
        .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
        .then((data) => {
          if (typeof data.views !== 'number') throw new Error('Invalid view response');
          setUnavailable(false);
          const newViews = typeof data.views === 'number' ? data.views : cached?.views ?? 0;
          setViews(newViews);

          // Merge with existing cache; reset lastFetchedAt and lastViewedDate
          const prev = readCache(slug);
          const updated: SlugCache = {
            views: newViews,
            likes: prev?.likes ?? 0,
            hasLiked: prev?.hasLiked ?? false,
            lastFetchedAt: Date.now(),
            lastViewedDate: todayUtcDate(),
          };
          writeCache(slug, updated);
        })
        .catch((err) => {
          console.error('[ViewCounter] Failed to record view:', err);
          setUnavailable(true);
          // Roll back optimistic increment
          if (cached !== null) setViews(cached.views);
        });
    } else {
      // Cache is stale but view already recorded today: fetch stats without recording a view
      fetch(`/api/stats/${slug}`)
        .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
        .then((data) => {
          if (typeof data.views !== 'number') throw new Error('Invalid stats response');
          setUnavailable(false);
          const newViews = typeof data.views === 'number' ? data.views : cached?.views ?? 0;
          setViews(newViews);

          const prev = readCache(slug);
          const updated: SlugCache = {
            views: newViews,
            likes: typeof data.likes === 'number' ? data.likes : prev?.likes ?? 0,
            hasLiked: typeof data.hasLiked === 'boolean' ? data.hasLiked : prev?.hasLiked ?? false,
            lastFetchedAt: Date.now(),
            lastViewedDate: prev?.lastViewedDate ?? '',
          };
          writeCache(slug, updated);
        })
        .catch((err) => { console.error('[ViewCounter] Failed to fetch stats:', err); setUnavailable(true); });
    }
  }, [slug]);

  return (
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      {unavailable ? '暂不可用' : views === null ? '...' : views.toLocaleString()}
    </span>
  );
}
