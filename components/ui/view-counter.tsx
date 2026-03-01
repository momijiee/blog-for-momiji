'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
}

const cacheKey = (slug: string) => `blog:views:${slug}`;

function readCache(slug: string): number | null {
  try {
    const raw = localStorage.getItem(cacheKey(slug));
    if (!raw) return null;
    const val = Number(raw);
    return Number.isFinite(val) ? val : null;
  } catch {
    return null;
  }
}

function writeCache(slug: string, views: number) {
  try {
    localStorage.setItem(cacheKey(slug), String(views));
  } catch {
    // localStorage 不可用时静默忽略
  }
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // 1. 立即从 localStorage 读取缓存，避免加载期间显示 "..."
    const cached = readCache(slug);
    if (cached !== null) setViews(cached);

    // 2. 触发浏览量计数（幂等：同 IP 同天只记一次），并用返回值更新缓存
    fetch(`/api/action/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'view' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.views === 'number') {
          setViews(data.views);
          writeCache(slug, data.views);
        }
      })
      .catch((err) => console.error('[ViewCounter] Failed to record view:', err));
  }, [slug]);

  return (
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      {views === null ? '...' : views.toLocaleString()}
    </span>
  );
}
