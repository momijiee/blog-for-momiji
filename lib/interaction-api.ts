import 'server-only';
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';

const baseUrl = process.env.MOMIJI_API_URL ?? 'https://api.momiji.dev';

export async function backendRequest(path: string, options: RequestInit = {}, visitorIp?: string): Promise<Response> {
  const url = new URL(path, baseUrl);
  if (url.protocol !== 'https:' && url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
    throw new Error('Backend must use HTTPS');
  }
  const headers = new Headers(options.headers);
  if (visitorIp) {
    const secret = process.env.INTERACTION_PROXY_SECRET;
    if (!secret || secret.length < 32 || !isIP(visitorIp)) throw new Error('Interaction proxy identity unavailable');
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createHmac('sha256', secret).update(`${timestamp}\n${visitorIp}`).digest('hex');
    headers.set('X-Momiji-Visitor-IP', visitorIp);
    headers.set('X-Momiji-Timestamp', timestamp);
    headers.set('X-Momiji-Signature', signature);
  }
  return fetch(url, { ...options, headers, cache: 'no-store', signal: AbortSignal.timeout(5000) });
}

export async function unwrapBackend<T>(response: Response): Promise<T> {
  const body = await response.json() as { code?: number; data?: T };
  if (!response.ok || body.code !== 0 || body.data === undefined) throw new Error('Invalid backend response');
  return body.data;
}

export function backendError(response: Response): Response {
  const status = [400, 409, 429].includes(response.status) ? response.status : 503;
  const headers = new Headers({ 'Cache-Control': 'no-store' });
  const retry = response.headers.get('Retry-After');
  if (retry) headers.set('Retry-After', retry);
  return Response.json({ error: status === 429 ? '请求过于频繁，请稍后重试' : status === 409 ? '请勿重复提交' : status === 503 ? '互动服务暂不可用，请稍后重试' : '请求内容无效' }, { status, headers });
}

export function unavailable(): Response {
  return Response.json({ error: '互动服务暂不可用，请稍后重试' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
}
