import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getIp } from "@/lib/get-ip";

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

/** Returns true for transient network errors that are safe to retry once. */
function isRetryable(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes('ECONNRESET') || msg.includes('fetch failed') || msg.includes('ETIMEDOUT');
}

async function fetchStats(slug: string, ip: string) {
  const [viewsResult, likesResult, hasLikedResult] = await Promise.all([
    getSupabaseAdmin()
      .from('post_views')
      .select('*', { count: 'exact', head: true })
      .eq('slug', slug),

    getSupabaseAdmin()
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('slug', slug),

    getSupabaseAdmin()
      .from('post_likes')
      .select('id')
      .eq('slug', slug)
      .eq('ip', ip)
      .maybeSingle(),
  ]);

  if (viewsResult.error) throw viewsResult.error;
  if (likesResult.error) throw likesResult.error;
  if (hasLikedResult.error) throw hasLikedResult.error;

  return {
    views: viewsResult.count ?? 0,
    likes: likesResult.count ?? 0,
    hasLiked: hasLikedResult.data !== null,
  };
}

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;

  // 获取请求方 IP，用于判断当前用户是否已点赞
  const ip = getIp(request);

  try {
    // 并行查询：浏览量、点赞数、当前 IP 是否已点赞
    // 对 ECONNRESET 等瞬时网络错误自动重试一次
    let data;
    try {
      data = await fetchStats(slug, ip);
    } catch (firstError) {
      if (isRetryable(firstError)) {
        console.warn('[GET /api/stats] Retrying after transient error:', firstError);
        data = await fetchStats(slug, ip);
      } else {
        throw firstError;
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[GET /api/stats] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
