export default function ActivityLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8" role="status" aria-live="polite">
      <h1 className="text-2xl font-semibold">个人动态</h1>
      <div className="mt-8 animate-pulse rounded-xl border p-6">
        <div className="h-7 w-64 rounded bg-muted" />
        <div className="mt-6 h-32 rounded bg-muted" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">正在加载活动数据…</p>
    </main>
  );
}
