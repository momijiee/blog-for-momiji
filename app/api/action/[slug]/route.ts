import { getPostBySlug } from '@/lib/posts';
import { getIp } from '@/lib/get-ip';
import { backendRequest, backendError, unavailable, unwrapBackend } from '@/lib/interaction-api';

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;
  if (!getPostBySlug(slug)) return Response.json({ error: 'Article not found' }, { status: 404 });
  let body: { type?: string };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON body' }, { status: 400 }); }
  if (body?.type !== 'view' && body?.type !== 'like') return Response.json({ error: 'Invalid type' }, { status: 400 });
  try {
    const response = await backendRequest(`/api/v1/interaction/${encodeURIComponent(slug)}/${body.type}`, { method: 'POST' }, getIp(request));
    if (!response.ok) return backendError(response);
    const data = await unwrapBackend<{ views?: number; likes?: number; alreadyLiked?: boolean }>(response);
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return unavailable(); }
}
