'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  slug: string;
}

interface StatsCache {
  likes: number;
  hasLiked: boolean;
}

const cacheKey = (slug: string) => `blog:stats:${slug}`;

function readCache(slug: string): StatsCache | null {
  try {
    const raw = localStorage.getItem(cacheKey(slug));
    return raw ? (JSON.parse(raw) as StatsCache) : null;
  } catch {
    return null;
  }
}

function writeCache(slug: string, data: StatsCache) {
  try {
    localStorage.setItem(cacheKey(slug), JSON.stringify(data));
  } catch {
    // localStorage 不可用时静默忽略
  }
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // 初始化：先从缓存读取（立即显示），再后台请求最新数据并更新缓存
  useEffect(() => {
    // 1. 立即从 localStorage 读取缓存，避免加载期间显示 "..."
    const cached = readCache(slug);
    if (cached) {
      setLikes(cached.likes);
      setHasLiked(cached.hasLiked);
    }

    // 2. 后台请求最新数据，到达后更新状态并写回缓存
    fetch(`/api/stats/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.likes === 'number') setLikes(data.likes);
        if (typeof data.hasLiked === 'boolean') setHasLiked(data.hasLiked);
        if (typeof data.likes === 'number' && typeof data.hasLiked === 'boolean') {
          writeCache(slug, { likes: data.likes, hasLiked: data.hasLiked });
        }
      })
      .catch((err) => console.error('[LikeButton] Failed to fetch stats:', err));
  }, [slug]);

  async function handleLike() {
    // 已点赞或请求进行中，不允许重复操作
    if (hasLiked || isPending) return;

    // 乐观更新：先在 UI 上立即反映变化
    setIsPending(true);
    setHasLiked(true);
    setLikes((prev) => (prev !== null ? prev + 1 : prev));

    try {
      const res = await fetch(`/api/action/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' }),
      });
      const data = await res.json();

      // 用服务端返回的真实数据修正本地状态，并更新缓存
      const newLikes = typeof data.likes === 'number' ? data.likes : likes;
      const newHasLiked = typeof data.alreadyLiked === 'boolean' ? (data.alreadyLiked || true) : true;
      if (typeof data.likes === 'number') setLikes(data.likes);
      if (typeof data.alreadyLiked === 'boolean') setHasLiked(newHasLiked);
      if (newLikes !== null) {
        writeCache(slug, { likes: newLikes as number, hasLiked: newHasLiked });
      }
    } catch (err) {
      // 请求失败时回滚乐观更新
      console.error('[LikeButton] Failed to record like:', err);
      setHasLiked(false);
      setLikes((prev) => (prev !== null ? prev - 1 : prev));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked || isPending}
      aria-label={hasLiked ? '已点赞' : '点赞'}
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
      <span>{likes === null ? '...' : likes.toLocaleString()}</span>
    </button>
  );
}
