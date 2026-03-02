'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import {
  readCache,
  writeCache,
  isCacheFresh,
  hasViewedToday,
  todayLocalDate,
  type SlugCache,
} from '@/lib/stats-cache';

interface ViewCounterProps {
  slug: string;
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const cached = readCache(slug);

    // 1. Immediately show cached views to avoid "..." flash
    if (cached !== null) {
      setViews(cached.views);
    }

    // 2. Decide whether to hit the DB
    const needsViewRecord = !cached || !hasViewedToday(cached);
    const needsFetch = !cached || !isCacheFresh(cached);

    if (!needsViewRecord && !needsFetch) {
      // Cache is fresh and view already recorded today – nothing to do
      return;
    }

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
        .then((res) => res.json())
        .then((data) => {
          const newViews = typeof data.views === 'number' ? data.views : cached?.views ?? 0;
          setViews(newViews);

          // Merge with existing cache; reset lastFetchedAt and lastViewedDate
          const prev = readCache(slug);
          const updated: SlugCache = {
            views: newViews,
            likes: prev?.likes ?? 0,
            hasLiked: prev?.hasLiked ?? false,
            lastFetchedAt: Date.now(),
            lastViewedDate: todayLocalDate(),
          };
          writeCache(slug, updated);
        })
        .catch((err) => {
          console.error('[ViewCounter] Failed to record view:', err);
          // Roll back optimistic increment
          if (cached !== null) setViews(cached.views);
        });
    } else if (needsFetch) {
      // Cache is stale but view already recorded today: fetch stats without recording a view
      fetch(`/api/stats/${slug}`)
        .then((res) => res.json())
        .then((data) => {
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
        .catch((err) => console.error('[ViewCounter] Failed to fetch stats:', err));
    }
  }, [slug]);

  return (
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      {views === null ? '...' : views.toLocaleString()}
    </span>
  );
}
