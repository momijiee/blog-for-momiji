import type { Comment } from '@/types/comment';
import CommentList from './comment-list';
import CommentForm from './comment-form';

interface CommentSectionProps {
  slug: string;
  comments: Comment[] | null;
}

/**
 * Server Component — receives pre-fetched approved comments from the parent page,
 * then delegates rendering to CommentList (server) and CommentForm (client).
 */
export default function CommentSection({ slug, comments }: CommentSectionProps) {
  return (
    <section id="comment-section" className="mt-16 border-t border-border pt-10">
      <h2 className="mb-8 text-2xl font-bold">
        评论
        {comments && comments.length > 0 && (
          <span className="ml-2 text-base font-normal text-muted-foreground">
            ({comments.length})
          </span>
        )}
      </h2>

      {comments === null ? (
        <p className="py-6 text-sm text-muted-foreground" role="status">评论服务暂不可用，请稍后再试。</p>
      ) : <CommentList comments={comments} />}
      <CommentForm slug={slug} />
    </section>
  );
}
