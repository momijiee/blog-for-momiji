/**
 * Extracts the real client IP from an incoming Request.
 *
 * Priority:
 *  1. x-real-ip  – set by Vercel/Nginx from the actual TCP connection (not spoofable)
 *  2. Last entry of x-forwarded-for – the rightmost IP is appended by your own proxy,
 *     so it is trustworthy even if the client sends a forged header.
 *  3. Fallback to '127.0.0.1' for local dev.
 */
export function getIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',');
    return parts[parts.length - 1].trim();
  }

  return '127.0.0.1';
}
