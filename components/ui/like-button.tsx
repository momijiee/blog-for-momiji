'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  readCache,
  writeCache,
  type SlugCache,
} from '@/lib/stats-cache';

interface LikeButtonProps {
  slug: string;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  // Initialise: show cache immediately, then conditionally fetch from DB
  useEffect(() => {
    const cached = readCache(slug);

    // 1. Show cached data right away to avoid "..." flash
    if (cached !== null) {
      setLikes(cached.likes);
      setHasLiked(cached.hasLiked);
    }

    // Revalidate on every mount so an outage is visible even with cached counts.

    fetch(`/api/stats/${slug}`)
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((data) => {
        if (typeof data.likes !== 'number' || typeof data.hasLiked !== 'boolean') throw new Error('Invalid stats response');
        setUnavailable(false);
        const newLikes = typeof data.likes === 'number' ? data.likes : cached?.likes ?? 0;
        const newHasLiked = typeof data.hasLiked === 'boolean' ? data.hasLiked : cached?.hasLiked ?? false;

        setLikes(newLikes);
        setHasLiked(newHasLiked);

        const prev = readCache(slug);
        const updated: SlugCache = {
          views: typeof data.views === 'number' ? data.views : prev?.views ?? 0,
          likes: newLikes,
          hasLiked: newHasLiked,
          lastFetchedAt: Date.now(),
          lastViewedDate: prev?.lastViewedDate ?? '',
        };
        writeCache(slug, updated);
      })
      .catch((err) => { console.error('[LikeButton] Failed to fetch stats:', err); setUnavailable(true); });
  }, [slug]);

  async function handleLike() {
    if (hasLiked || isPending || unavailable) return;

    // Optimistic update
    setIsPending(true);
    setHasLiked(true);
    setLikes((prev) => (prev !== null ? prev + 1 : prev));

    try {
      const res = await fetch(`/api/action/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof data.likes !== 'number') throw new Error('Invalid like response');

      const newLikes = typeof data.likes === 'number' ? data.likes : likes;
      // After any like action (fresh or duplicate), the user has always liked this post.
      const newHasLiked = true;

      if (typeof data.likes === 'number') setLikes(data.likes);
      setHasLiked(newHasLiked);

      // Write back to cache with refreshed TTL
      if (newLikes !== null) {
        const prev = readCache(slug);
        const updated: SlugCache = {
          views: prev?.views ?? 0,
          likes: newLikes as number,
          hasLiked: newHasLiked,
          lastFetchedAt: Date.now(),
          lastViewedDate: prev?.lastViewedDate ?? '',
        };
        writeCache(slug, updated);
      }
    } catch (err) {
      // Roll back optimistic update on failure
      console.error('[LikeButton] Failed to record like:', err);
      setUnavailable(true);
      setHasLiked(false);
      setLikes((prev) => (prev !== null ? prev - 1 : prev));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked || isPending || unavailable}
      aria-label={unavailable ? '点赞服务暂不可用' : hasLiked ? '已点赞' : '点赞'}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-all',
        'border border-border',
        hasLiked
          ? 'cursor-default border-rose-300 bg-rose-50 text-rose-500 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400'
          : 'cursor-pointer text-muted-foreground hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 dark:hover:border-rose-800 dark:hover:bg-rose-950 dark:hover:text-rose-400'
      )}
    >
      <Heart
        className={cn('h-4 w-4 transition-all', hasLiked && 'fill-current')}
      />
      <span>{unavailable ? '暂不可用' : likes === null ? '...' : likes.toLocaleString()}</span>
    </button>
  );
}
