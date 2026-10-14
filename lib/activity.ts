export type ActivitySource = "github" | "openrouter" | "leetcode" | "codex";

export interface ActivityDay {
  source: ActivitySource;
  source_date: string;
  source_timezone: string;
  metric: string;
  value: number;
  collected_at: string;
  status: string;
}

export interface ActivitySourceState {
  source: ActivitySource;
  metric: string;
  status: string;
  last_attempt_at: string | null;
  last_success_at: string | null;
  latest_source_date: string | null;
}

export interface ActivityResponse {
  days: ActivityDay[];
  sources: ActivitySourceState[];
  from: string;
  to: string;
}

const sourceNames = new Set<ActivitySource>(["github", "openrouter", "leetcode", "codex"]);

export async function getActivity(from: string, to: string): Promise<ActivityResponse> {
  const base = process.env.MOMIJI_API_URL ?? "https://api.momiji.dev";
  const url = new URL("/api/v1/activity", base);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  const response = await fetch(url, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Activity API returned ${response.status}`);

  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("code" in result) || result.code !== 0 ||
      !("data" in result) || !result.data || typeof result.data !== "object") {
    throw new Error("Invalid activity API response");
  }

  const data = result.data as Partial<ActivityResponse>;
  if (!Array.isArray(data.days) || !Array.isArray(data.sources)) {
    throw new Error("Activity API omitted days or source states");
  }
  return {
    days: data.days.filter((day) => sourceNames.has(day.source) &&
      /^\d{4}-\d{2}-\d{2}$/.test(day.source_date) &&
      Number.isSafeInteger(day.value) && day.value >= 0),
    sources: data.sources.filter((source) => sourceNames.has(source.source)),
    from,
    to,
  };
}
