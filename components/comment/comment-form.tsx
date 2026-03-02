'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CommentFormProps {
  slug: string;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function CommentForm({ slug }: CommentFormProps) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const MAX_CONTENT = 500;
  const remaining = MAX_CONTENT - content.length;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!content.trim()) return;
    if (content.trim().length > MAX_CONTENT) return;

    setSubmitState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim() || undefined,
          email: email.trim() || undefined,
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }

      setSubmitState('success');
      setNickname('');
      setEmail('');
      setContent('');
    } catch (err) {
      console.error('[CommentForm] submit error:', err);
      setErrorMsg(err instanceof Error ? err.message : '提交失败，请稍后重试');
      setSubmitState('error');
    }
  }

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-lg font-semibold">发表评论</h3>

      {submitState === 'success' ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
          🎉 评论已提交，审核通过后将会显示。感谢你的留言！
        </div>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          {/* Nickname + Email row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Nickname */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="comment-nickname"
                className="text-sm font-medium text-foreground"
              >
                昵称
                <span className="ml-1 text-xs text-muted-foreground">（选填）</span>
              </label>
              <input
                id="comment-nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="匿名"
                maxLength={50}
                disabled={submitState === 'submitting'}
                className={cn(
                  'rounded-lg border border-border bg-background px-3 py-2 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/40',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="comment-email"
                className="text-sm font-medium text-foreground"
              >
                邮箱
                <span className="ml-1 text-xs text-muted-foreground">（选填，不公开）</span>
              </label>
              <input
                id="comment-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                maxLength={254}
                disabled={submitState === 'submitting'}
                className={cn(
                  'rounded-lg border border-border bg-background px-3 py-2 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/40',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="comment-content"
              className="text-sm font-medium text-foreground"
            >
              评论内容
              <span className="ml-1 text-xs text-rose-500">*</span>
            </label>
            <textarea
              id="comment-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下你的想法…"
              rows={4}
              maxLength={MAX_CONTENT}
              required
              disabled={submitState === 'submitting'}
              className={cn(
                'resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/40',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            />
            {/* Character counter */}
            <span
              className={cn(
                'self-end text-xs',
                remaining < 50 ? 'text-rose-500' : 'text-muted-foreground',
              )}
            >
              {remaining} / {MAX_CONTENT}
            </span>
          </div>

          {/* Error message */}
          {submitState === 'error' && errorMsg && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
              {errorMsg}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitState === 'submitting' || !content.trim() || remaining < 0}
            className={cn(
              'self-start rounded-lg px-5 py-2 text-sm font-medium transition-all',
              'bg-primary text-primary-foreground',
              'hover:opacity-90 active:scale-95',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {submitState === 'submitting' ? '提交中…' : '提交评论'}
          </button>
        </form>
      )}
    </div>
  );
}
