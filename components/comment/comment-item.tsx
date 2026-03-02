import type { Comment } from '@/types/comment';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: Comment;
  /** Nested replies to this comment */
  replies?: Comment[];
  /** Depth level for visual indentation (0 = top-level) */
  depth?: number;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function CommentItem({
  comment,
  replies = [],
  depth = 0,
}: CommentItemProps) {
  const displayName = comment.nickname?.trim() || '匿名';

  return (
    <div className={cn('flex flex-col gap-3', depth > 0 && 'ml-6 border-l pl-4 border-border')}>
      {/* Comment bubble */}
      <div className="rounded-xl bg-muted/50 px-4 py-3 text-sm">
        {/* Header */}
        <div className="mb-1.5 flex items-center gap-2">
          {/* Avatar placeholder */}
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
          >
            {displayName.charAt(0).toUpperCase()}
          </span>

          <span className="font-medium text-foreground">{displayName}</span>

          <time
            dateTime={comment.created_at}
            className="ml-auto text-xs text-muted-foreground"
          >
            {formatDate(comment.created_at)}
          </time>
        </div>

        {/* Body */}
        <p className="whitespace-pre-wrap break-words leading-relaxed text-foreground/80">
          {comment.content}
        </p>
      </div>

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="flex flex-col gap-3">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
