import type { Comment } from '@/types/comment';
import CommentItem from './comment-item';

interface CommentListProps {
  comments: Comment[];
}

/**
 * Assembles a flat list of comments into a parent → children tree,
 * then renders each root comment with its replies.
 */
export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        还没有评论，来留下第一条吧 ✨
      </p>
    );
  }

  // Build a map: parent_id → children
  const childrenMap = new Map<string, Comment[]>();
  const roots: Comment[] = [];

  for (const comment of comments) {
    if (comment.parent_id) {
      const siblings = childrenMap.get(comment.parent_id) ?? [];
      siblings.push(comment);
      childrenMap.set(comment.parent_id, siblings);
    } else {
      roots.push(comment);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {roots.map((root) => (
        <CommentItem
          key={root.id}
          comment={root}
          replies={childrenMap.get(root.id) ?? []}
          depth={0}
        />
      ))}
    </div>
  );
}
