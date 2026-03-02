import { getApprovedComments } from '@/lib/comment';
import CommentList from './comment-list';
import CommentForm from './comment-form';

interface CommentSectionProps {
  slug: string;
}

/**
 * Server Component — fetches approved comments at request time,
 * then delegates rendering to CommentList (server) and CommentForm (client).
 */
export default async function CommentSection({ slug }: CommentSectionProps) {
  const comments = await getApprovedComments(slug);

  return (
    <section id="comment-section" className="mt-16 border-t border-border pt-10">
      <h2 className="mb-8 text-2xl font-bold">
        评论
        {comments.length > 0 && (
          <span className="ml-2 text-base font-normal text-muted-foreground">
            ({comments.length})
          </span>
        )}
      </h2>

      <CommentList comments={comments} />
      <CommentForm slug={slug} />
    </section>
  );
}
