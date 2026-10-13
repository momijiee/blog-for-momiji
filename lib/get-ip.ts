/** Vercel overwrites x-forwarded-for for Functions; local development uses loopback. */
export function getIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
}
