"use client";

import { useMemo, useState } from "react";
import type { ActivityDay, ActivityResponse, ActivitySource } from "@/lib/activity";

const SOURCES: Record<ActivitySource, { name: string; unit: string; timezone: string; note: string }> = {
  github: { name: "GitHub", unit: "贡献", timezone: "UTC", note: "个人资料贡献日历；只包含资料页可见的贡献。" },
  openrouter: { name: "OpenRouter", unit: "请求", timezone: "UTC", note: "每天的 API 请求次数；当前只回填近 30 日。" },
  leetcode: { name: "LeetCode", unit: "通过题目", timezone: "Asia/Shanghai", note: "中国站当天首次通过的独立题目数；数据待手动导入。" },
  codex: { name: "Codex", unit: "桌面会话", timezone: "Asia/Shanghai", note: "这台设备已保存的桌面会话启动数；未覆盖其他设备或云端。" },
};
const SOURCE_ORDER: ActivitySource[] = ["github", "openrouter", "leetcode", "codex"];
const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function shiftDate(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
}

function calendarWeeks(from: string, to: string) {
  const weekday = new Date(`${from}T00:00:00Z`).getUTCDay();
  const start = shiftDate(from, -((weekday + 6) % 7));
  const weeks: (string | null)[][] = [];
  for (let week = start; week <= to; week = shiftDate(week, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, i) => {
      const date = shiftDate(week, i);
      return date >= from && date <= to ? date : null;
    }));
  }
  return weeks;
}

function valueClass(value: number) {
  if (value === 0) return "border-border bg-muted text-foreground";
  if (value === 1) return "border-emerald-300 bg-emerald-200 dark:border-emerald-800 dark:bg-emerald-900";
  if (value <= 3) return "border-emerald-400 bg-emerald-400 dark:border-emerald-700 dark:bg-emerald-700";
  if (value <= 7) return "border-emerald-500 bg-emerald-600 dark:border-emerald-600 dark:bg-emerald-600";
  return "border-emerald-700 bg-emerald-800 dark:border-emerald-400 dark:bg-emerald-400";
}

function formatTime(value: string | null | undefined) {
  if (!value) return "尚无成功同步";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "未知" : new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Shanghai",
  }).format(date);
}

export function ActivityBoard({ activity }: { activity: ActivityResponse }) {
  const [source, setSource] = useState<ActivitySource>("github");
  const [range, setRange] = useState<90 | 365>(365);
  const [selectedDate, setSelectedDate] = useState(activity.to);
  const from = range === 90 ? shiftDate(activity.to, -89) : activity.from;
  const weeks = useMemo(() => calendarWeeks(from, activity.to), [from, activity.to]);
  const sourceState = activity.sources.find((item) => item.source === source);
  const records = useMemo(() => new Map(activity.days
    .filter((day) => day.source === source)
    .map((day) => [day.source_date, day])), [activity.days, source]);
  const selectedRecord: ActivityDay | undefined = records.get(selectedDate);
  const selectedStatus = selectedRecord
    ? selectedRecord.value === 0 ? "确认为零活动" : `${selectedRecord.value} ${SOURCES[source].unit}`
    : sourceState?.status === "error" ? "采集失败，暂无该日数据" : "等待同步，暂无该日数据";

  function chooseSource(next: ActivitySource) {
    setSource(next);
    setSelectedDate(activity.sources.find((item) => item.source === next)?.latest_source_date ?? activity.to);
  }

  return (
    <section className="mt-8 rounded-xl border bg-card p-4 sm:p-6" aria-label="每日活动棋盘">
      <div className="flex flex-wrap gap-2" aria-label="选择数据来源">
        {SOURCE_ORDER.map((item) => (
          <button key={item} type="button" aria-pressed={source === item} onClick={() => chooseSource(item)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${source === item ? "border-foreground bg-foreground text-background" : "hover:bg-muted"}`}>
            {SOURCES[item].name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{SOURCES[source].name} · {SOURCES[source].unit}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{SOURCES[source].note} 日期按 {SOURCES[source].timezone} 记录。</p>
          <p className="mt-1 text-sm text-muted-foreground">最近成功同步：{formatTime(sourceState?.last_success_at)}；最新数据日期：{sourceState?.latest_source_date ?? "暂无"}</p>
        </div>
        <div className="flex gap-2" aria-label="选择时间范围">
          {([90, 365] as const).map((value) => (
            <button key={value} type="button" aria-pressed={range === value} onClick={() => setRange(value)}
              className={`rounded-md border px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${range === value ? "bg-secondary font-medium" : "hover:bg-muted"}`}>
              {value === 90 ? "近 90 天" : "近一年"}
            </button>
          ))}
        </div>
      </div>

      {sourceState?.status === "error" && <p role="status" className="mt-4 text-sm text-destructive">最近一次采集失败；已有历史数据仍可查看。</p>}
      {sourceState?.status === "not_collected" && <p role="status" className="mt-4 text-sm text-muted-foreground">该来源尚未采集到真实数据。</p>}

      <p className="mt-6 text-sm text-muted-foreground">{from} 至 {activity.to} · 横向滚动查看较早日期</p>
      <div className="mt-3 overflow-x-auto pb-3" tabIndex={0} aria-label="按周排列的活动日历，可横向滚动">
        <div className="flex min-w-max gap-1">
          <div className="grid grid-rows-7 gap-1 pr-2 text-xs text-muted-foreground" aria-hidden="true">
            {WEEKDAYS.map((day) => <span key={day} className="flex h-4 w-4 items-center justify-center">{day}</span>)}
          </div>
          {weeks.map((week, index) => (
            <div key={index} className="grid grid-rows-7 gap-1">
              {week.map((date, day) => {
                if (!date) return <span key={day} className="h-4 w-4" aria-hidden="true" />;
                const record = records.get(date);
                const state = record ? record.value === 0 ? "零活动" : `${record.value} ${SOURCES[source].unit}`
                  : sourceState?.status === "error" ? "采集失败或尚未覆盖" : "等待同步或尚未覆盖";
                return (
                  <button key={date} type="button" title={`${date}：${state}`}
                    aria-label={`${SOURCES[source].name} ${date}：${state}`} aria-pressed={selectedDate === date}
                    onClick={() => setSelectedDate(date)}
                    className={`h-4 w-4 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${record ? valueClass(record.value) : "border-dashed border-muted-foreground/40 bg-transparent"} ${selectedDate === date ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground" aria-label="活动图例">
        <span>图例：</span>
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm border bg-muted" />确认为零</span>
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm border border-emerald-300 bg-emerald-200" />1</span>
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm border border-emerald-500 bg-emerald-600" />较多</span>
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm border border-dashed" />无可靠数据</span>
      </div>

      <div className="mt-6 rounded-lg bg-muted/50 p-4" aria-live="polite">
        <h3 className="font-medium">{selectedDate} · {SOURCES[source].name}</h3>
        <p className="mt-1 text-sm">{selectedStatus}</p>
        <p className="mt-1 text-xs text-muted-foreground">单位：{SOURCES[source].unit}；日期时区：{selectedRecord?.source_timezone ?? SOURCES[source].timezone}；采集于：{formatTime(selectedRecord?.collected_at)}</p>
      </div>
    </section>
  );
}
