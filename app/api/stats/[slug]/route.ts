import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;

  // 获取请求方 IP，用于判断当前用户是否已点赞
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  try {
    // 并行查询：浏览量、点赞数、当前 IP 是否已点赞
    const [viewsResult, likesResult, hasLikedResult] = await Promise.all([
      supabaseAdmin
        .from('post_views')
        .select('*', { count: 'exact', head: true })
        .eq('slug', slug),

      supabaseAdmin
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('slug', slug),

      supabaseAdmin
        .from('post_likes')
        .select('id')
        .eq('slug', slug)
        .eq('ip', ip)
        .maybeSingle(),
    ]);

    if (viewsResult.error) throw viewsResult.error;
    if (likesResult.error) throw likesResult.error;
    if (hasLikedResult.error) throw hasLikedResult.error;

    return NextResponse.json({
      views: viewsResult.count ?? 0,
      likes: likesResult.count ?? 0,
      hasLiked: hasLikedResult.data !== null,
    });
  } catch (error) {
    console.error('[GET /api/stats] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
