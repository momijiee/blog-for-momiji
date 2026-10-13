import { getPostBySlug } from '@/lib/posts';
import { getIp } from '@/lib/get-ip';
import { backendRequest, backendError, unavailable, unwrapBackend } from '@/lib/interaction-api';

export const dynamic = 'force-dynamic';
type Params = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  if (!getPostBySlug(slug)) return Response.json({ error: 'Article not found' }, { status: 404 });
  try {
    const response = await backendRequest(`/api/v1/interaction/${encodeURIComponent(slug)}/stats`, {}, getIp(request));
    if (!response.ok) return backendError(response);
    const data = await unwrapBackend<{ views: number; likes: number; hasLiked: boolean }>(response);
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return unavailable(); }
}
