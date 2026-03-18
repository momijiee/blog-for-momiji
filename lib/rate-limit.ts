/**
 * In-Memory Rate Limiter (Sliding Window)
 *
 * ⚠️  注意：此实现基于进程内存，在 serverless 环境（Vercel）中每个函数实例
 *     拥有独立内存，无法跨实例共享状态。对于低流量个人博客已足够使用。
 *     如需跨实例精确限流，请改用 Upstash Redis + @upstash/ratelimit。
 */

interface RateLimitEntry {
  /** 时间窗口内的请求时间戳列表（Sliding Window） */
  timestamps: number[];
}

// 全局 store，key = `${identifier}:${action}`
const store = new Map<string, RateLimitEntry>();

// 每 5 分钟清理一次过期条目，防止内存泄漏
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    // 如果最后一次请求已超过 10 分钟，删除该条目
    const lastTs = entry.timestamps[entry.timestamps.length - 1] ?? 0;
    if (now - lastTs > 10 * 60 * 1000) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

export interface RateLimitResult {
  /** 是否允许本次请求 */
  success: boolean;
  /** 当前窗口内已使用的请求次数 */
  used: number;
  /** 当前窗口内的请求上限 */
  limit: number;
  /** 剩余可用次数 */
  remaining: number;
  /** 窗口重置时间（Unix ms） */
  resetAt: number;
}

/**
 * 检查指定 key 是否超出速率限制（Sliding Window 算法）
 *
 * @param key       唯一标识，通常为 `${ip}:${action}`
 * @param limit     时间窗口内允许的最大请求次数
 * @param windowMs  时间窗口大小（毫秒）
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // 移除窗口外的旧时间戳
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  const used = entry.timestamps.length;
  const resetAt = entry.timestamps[0]
    ? entry.timestamps[0] + windowMs
    : now + windowMs;

  if (used >= limit) {
    return {
      success: false,
      used,
      limit,
      remaining: 0,
      resetAt,
    };
  }

  // 记录本次请求
  entry.timestamps.push(now);

  return {
    success: true,
    used: used + 1,
    limit,
    remaining: limit - used - 1,
    resetAt,
  };
}
