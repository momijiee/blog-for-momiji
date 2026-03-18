import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { Comment } from '@/types/comment';

/**
 * Fetch all approved comments for a given post slug.
 * Returns a flat list ordered by created_at ascending;
 * the tree structure is assembled in the UI layer.
 */
export async function getApprovedComments(slug: string): Promise<Comment[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('comments')
    .select('id, parent_id, nickname, content, created_at')
    .eq('slug', slug)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[getApprovedComments] Supabase error:', error);
    return [];
  }

  return (data ?? []) as Comment[];
}

/**
 * Submit a new comment (status defaults to "pending" in the DB).
 * Called from the API route; exposed here so the route stays thin.
 */
export interface SubmitCommentPayload {
  slug: string;
  nickname?: string;
  email?: string;
  content: string;
  parent_id?: string;
  ip: string;
  userAgent: string;
}

export interface SubmitCommentResult {
  id: string;
  created_at: string;
}

export async function submitComment(
  payload: SubmitCommentPayload,
): Promise<SubmitCommentResult> {
  const { slug, nickname, email, content, parent_id, ip, userAgent } = payload;

  const { data, error } = await getSupabaseAdmin()
    .from('comments')
    .insert({
      slug,
      parent_id: parent_id ?? null,
      nickname: nickname?.trim() || null,
      email: email?.trim() || null,
      content: content.trim(),
      status: 'pending',
      ip,
      user_agent: userAgent,
    })
    .select('id, created_at')
    .single();

  if (error) {
    console.error('[submitComment] Supabase error:', error);
    throw new Error('Failed to submit comment');
  }

  return data as SubmitCommentResult;
}
