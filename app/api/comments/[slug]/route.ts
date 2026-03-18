import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getIp } from "@/lib/get-ip";

export const dynamic = 'force-dynamic';


type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;

  try {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('id, parent_id, nickname, content, created_at')
      .eq('slug', slug)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ comments: data ?? [] });
  } catch (error) {
    console.error('[GET /api/comments] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;
  const ip = getIp(request);
  const userAgent = request.headers.get('user-agent') ?? '';

  let body: { nickname?: string; email?: string; content?: string; parent_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { nickname, email, content, parent_id } = body;

  // content 是必填项
  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 });
  }

  // 防止超长内容
  if (content.trim().length > 500) {
    return NextResponse.json({ error: 'content too long (max 500 chars)' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        slug,
        parent_id: parent_id ?? null,
        nickname: nickname?.trim() || null,
        email: email?.trim() || null,
        content: content.trim(),
        status: 'pending',   // 默认待审核
        ip,
        user_agent: userAgent,
      })
      .select('id, created_at')
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: 'Comment submitted, pending review', id: data.id, created_at: data.created_at },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/comments] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit comment' },
      { status: 500 }
    );
  }
}