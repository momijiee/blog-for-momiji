import { getPostBySlug } from '@/lib/posts';
import { getIp } from '@/lib/get-ip';
import { backendRequest, backendError, unavailable, unwrapBackend } from '@/lib/interaction-api';
import type { Comment } from '@/types/comment';

export const dynamic = 'force-dynamic';
type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  if (!getPostBySlug(slug)) return Response.json({ error: 'Article not found' }, { status: 404 });
  try {
    const response = await backendRequest(`/api/v1/interaction/${encodeURIComponent(slug)}/comments`);
    if (!response.ok) return backendError(response);
    const comments = await unwrapBackend<Comment[]>(response);
    return Response.json({ comments }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return unavailable(); }
}

export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;
  if (!getPostBySlug(slug)) return Response.json({ error: 'Article not found' }, { status: 404 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON body' }, { status: 400 }); }
  if (!body || typeof body !== 'object') return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  try {
    const response = await backendRequest(`/api/v1/interaction/${encodeURIComponent(slug)}/comments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': request.headers.get('user-agent') ?? '' },
      body: JSON.stringify(body),
    }, getIp(request));
    if (!response.ok) return backendError(response);
    const data = await unwrapBackend<{ id: string; created_at: string }>(response);
    return Response.json({ message: 'Comment submitted, pending review', ...data }, { status: 201 });
  } catch { return unavailable(); }
}
