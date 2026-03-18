import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getIp } from "@/lib/get-ip";
import { checkRateLimit } from "@/lib/rate-limit";

type Params = { params: Promise<{ slug: string }> };

/**
 * POST /api/action/[slug]
 * Body: { type: 'view' | 'like' }
 *
 * type=view: 记录浏览量（同一 IP 同一天只计入一次）
 * type=like: 记录点赞（同一 IP 只能点赞一次）
 */
export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;
  const ip = getIp(request);

  let body: { type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { type } = body;

  if (type === 'view') {
    // 浏览量：每 IP 每分钟最多 10 次（防止脚本刷量，正常翻页不受影响）
    const rl = checkRateLimit(`${ip}:view`, 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rl.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rl.resetAt / 1000).toString(),
            'Retry-After': Math.ceil((rl.resetAt - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    return handleView(slug, ip);
  }

  if (type === 'like') {
    // 点赞：每 IP 每分钟最多 5 次（DB 层已有唯一约束，此处防止无效请求轰炸）
    const rl = checkRateLimit(`${ip}:like`, 5, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rl.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rl.resetAt / 1000).toString(),
            'Retry-After': Math.ceil((rl.resetAt - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    return handleLike(slug, ip);
  }

  return NextResponse.json(
    { error: 'Invalid type. Must be "view" or "like".' },
    { status: 400 }
  );
}

// ─── 浏览量处理 ────────────────────────────────────────────────────────────────

async function handleView(slug: string, ip: string) {
  // 获取今天的日期字符串，格式 YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  // upsert: 若 (slug, ip, viewed_date) 已存在则忽略（onConflict），不报错
  const { error } = await getSupabaseAdmin()
    .from('post_views')
    .upsert(
      { slug, ip, viewed_date: today },
      { onConflict: 'slug,ip,viewed_date', ignoreDuplicates: true }
    );

  if (error) {
    console.error('[action/view] upsert error:', error);
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
  }

  // 返回最新浏览量
  const { count, error: countError } = await getSupabaseAdmin()
    .from('post_views')
    .select('*', { count: 'exact', head: true })
    .eq('slug', slug);

  if (countError) {
    console.error('[action/view] count error:', countError);
    return NextResponse.json({ error: 'Failed to fetch view count' }, { status: 500 });
  }

  return NextResponse.json({ views: count ?? 0 });
}

// ─── 点赞处理 ──────────────────────────────────────────────────────────────────

async function handleLike(slug: string, ip: string) {
  const { error } = await getSupabaseAdmin()
    .from('post_likes')
    .insert({ slug, ip });

  // 错误码 23505 = 唯一约束冲突，即该 IP 已经点过赞
  if (error) {
    if (error.code === '23505') {
      // 已点赞，返回当前点赞数和已点赞标志
      const { count } = await getSupabaseAdmin()
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('slug', slug);

      return NextResponse.json({ likes: count ?? 0, alreadyLiked: true });
    }

    console.error('[action/like] insert error:', error);
    return NextResponse.json({ error: 'Failed to record like' }, { status: 500 });
  }

  // 点赞成功，返回最新点赞数
  const { count, error: countError } = await getSupabaseAdmin()
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('slug', slug);

  if (countError) {
    console.error('[action/like] count error:', countError);
    return NextResponse.json({ error: 'Failed to fetch like count' }, { status: 500 });
  }

  return NextResponse.json({ likes: count ?? 0, alreadyLiked: false });
}
