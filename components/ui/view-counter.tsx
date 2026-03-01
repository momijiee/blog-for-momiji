'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // 1. 触发浏览量计数（幂等：同 IP 同天只记一次）
    fetch(`/api/action/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'view' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.views === 'number') {
          setViews(data.views);
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
