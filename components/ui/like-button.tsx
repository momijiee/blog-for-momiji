'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  slug: string;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // 初始化：从 stats 接口获取点赞数和当前 IP 是否已点赞
  useEffect(() => {
    fetch(`/api/stats/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.likes === 'number') setLikes(data.likes);
        if (typeof data.hasLiked === 'boolean') setHasLiked(data.hasLiked);
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

      // 用服务端返回的真实数据修正本地状态
      if (typeof data.likes === 'number') setLikes(data.likes);
      if (typeof data.alreadyLiked === 'boolean') setHasLiked(data.alreadyLiked || true);
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
