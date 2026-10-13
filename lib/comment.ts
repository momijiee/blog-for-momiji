import type { Comment } from '@/types/comment';
import { backendRequest, unwrapBackend } from '@/lib/interaction-api';

/**
 * Fetch all approved comments for a given post slug.
 * Returns a flat list ordered by created_at ascending;
 * the tree structure is assembled in the UI layer.
 */
export async function getApprovedComments(slug: string): Promise<Comment[] | null> {
  try {
    const response = await backendRequest(`/api/v1/interaction/${encodeURIComponent(slug)}/comments`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await unwrapBackend<Comment[]>(response);
  } catch (error) {
    console.error('[getApprovedComments] Go API unavailable:', error);
    return null;
  }
}
