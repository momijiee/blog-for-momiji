import type { Metadata } from "next";
import { ActivityBoard } from "@/components/activity/activity-board";
import { getActivity } from "@/lib/activity";

export const metadata: Metadata = {
  title: "个人动态",
  description: "按日查看 GitHub、OpenRouter、LeetCode 和 Codex 的个人活动。",
  alternates: { canonical: "/activity" },
};
export const revalidate = 3600;

function dayInShanghai() {
  return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default async function ActivityPage() {
  const to = dayInShanghai();
  const from = new Date(Date.parse(`${to}T00:00:00Z`) - 364 * 86400000).toISOString().slice(0, 10);
  let activity;
  try {
    activity = await getActivity(from, to);
  } catch {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold">个人动态</h1>
        <p role="status" className="mt-6 text-muted-foreground">活动数据暂不可用，请稍后再试。文章阅读不受影响。</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">个人动态</h1>
      <p className="mt-2 text-sm text-muted-foreground">四种来源分别计量；空白日期表示没有可靠数据，不代表零活动。</p>
      <ActivityBoard activity={activity} />
    </main>
  );
}
