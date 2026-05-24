"use client";

import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/date";
import type {
  ApplicationLog,
  DailyLogCount,
  LogLevel,
  LogsSummary,
} from "@/lib/types";

type ApplicationLogInsightsProps = {
  applicationName: string;
};

type LevelDatum = {
  level: LogLevel;
  count: number;
  uniqueLogs: number;
};

type DailyPoint = {
  day: string;
  INFO: number;
  WARN: number;
  ERROR: number;
};

const LEVELS: LogLevel[] = ["INFO", "WARN", "ERROR"];

const LEVEL_META: Record<
  LogLevel,
  { color: string; label: string; badge: "secondary" | "default" | "destructive" }
> = {
  INFO: { color: "#2563eb", label: "Info", badge: "secondary" },
  WARN: { color: "#ca8a04", label: "Warn", badge: "default" },
  ERROR: { color: "#dc2626", label: "Error", badge: "destructive" },
};

const EMPTY_SUMMARY: LogsSummary = {
  levelCounts: [],
  dailyCounts: [],
  totals: {
    totalEvents: 0,
    uniqueLogs: 0,
  },
  latestLog: null,
  topLog: null,
};

export function ApplicationLogInsights({
  applicationName,
}: ApplicationLogInsightsProps) {
  const [summary, setSummary] = React.useState<LogsSummary>(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadSummary = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextSummary = await api.logsSummary(applicationName);
      setSummary(nextSummary);
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "Unable to load log insights.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [applicationName]);

  React.useEffect(() => {
    let isActive = true;

    const loadInitialSummary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSummary = await api.logsSummary(applicationName);
        if (!isActive) {
          return;
        }
        setSummary(nextSummary);
      } catch (loadError) {
        if (!isActive) {
          return;
        }
        setError(
          loadError instanceof ApiError
            ? loadError.message
            : "Unable to load log insights.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialSummary();

    return () => {
      isActive = false;
    };
  }, [applicationName]);

  const levelData = React.useMemo(() => normalizeLevelData(summary), [summary]);
  const dailyData = React.useMemo(() => normalizeDailyData(summary.dailyCounts), [
    summary.dailyCounts,
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Log Insights</CardTitle>
            <CardDescription>
              Level distribution and daily activity by severity.
            </CardDescription>
          </div>
          <Button
            disabled={isLoading}
            onClick={() => void loadSummary()}
            size="sm"
            type="button"
            variant="outline"
          >
            <RefreshCw className={isLoading ? "animate-spin" : undefined} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-lg border bg-background p-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading insights
          </div>
        ) : (
          <>
            <SummaryStats summary={summary} />
            <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
              <LevelPieChart data={levelData} total={summary.totals.totalEvents} />
              <DailyLineChart data={dailyData} />
            </div>
            <LogHighlights latestLog={summary.latestLog} topLog={summary.topLog} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function normalizeLevelData(summary: LogsSummary): LevelDatum[] {
  return LEVELS.map((level) => {
    const found = summary.levelCounts.find((entry) => entry._id === level);
    return {
      level,
      count: found?.count ?? 0,
      uniqueLogs: found?.uniqueLogs ?? 0,
    };
  });
}

function normalizeDailyData(dailyCounts: DailyLogCount[]): DailyPoint[] {
  const points = new Map<string, DailyPoint>();

  dailyCounts.forEach((entry) => {
    const point =
      points.get(entry.day) ??
      ({
        day: entry.day,
        INFO: 0,
        WARN: 0,
        ERROR: 0,
      } satisfies DailyPoint);

    point[entry.level] = entry.count;
    points.set(entry.day, point);
  });

  return Array.from(points.values()).sort((left, right) =>
    left.day.localeCompare(right.day),
  );
}

function SummaryStats({ summary }: { summary: LogsSummary }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard label="Total events" value={summary.totals.totalEvents} />
      <StatCard label="Unique log messages" value={summary.totals.uniqueLogs} />
      <StatCard
        label="Most frequent"
        value={summary.topLog ? `${summary.topLog.count}x` : "0x"}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function LevelPieChart({ data, total }: { data: LevelDatum[]; total: number }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="rounded-lg border bg-background p-5">
      <h3 className="text-sm font-medium text-foreground">Level ratio</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center xl:grid-cols-1">
        <div className="relative mx-auto size-44">
          <svg className="size-44 -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              fill="none"
              r={radius}
              stroke="currentColor"
              strokeOpacity="0.12"
              strokeWidth="24"
            />
            {total > 0
              ? data.map((entry) => {
                  const dash = (entry.count / total) * circumference;
                  const segment = (
                    <circle
                      cx="80"
                      cy="80"
                      fill="none"
                      key={entry.level}
                      r={radius}
                      stroke={LEVEL_META[entry.level].color}
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="butt"
                      strokeWidth="24"
                    />
                  );
                  offset += dash;
                  return segment;
                })
              : null}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">events</span>
          </div>
        </div>
        <div className="space-y-3">
          {data.map((entry) => (
            <LevelLegendItem entry={entry} key={entry.level} total={total} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LevelLegendItem({
  entry,
  total,
}: {
  entry: LevelDatum;
  total: number;
}) {
  const percentage = total === 0 ? 0 : Math.round((entry.count / total) * 100);

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="size-3 rounded-sm"
          style={{ backgroundColor: LEVEL_META[entry.level].color }}
        />
        <span className="font-medium text-foreground">
          {LEVEL_META[entry.level].label}
        </span>
      </div>
      <span className="text-muted-foreground">
        {entry.count} · {percentage}%
      </span>
    </div>
  );
}

function DailyLineChart({ data }: { data: DailyPoint[] }) {
  const width = 720;
  const height = 260;
  const padding = { top: 18, right: 20, bottom: 38, left: 44 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...data.flatMap((point) => LEVELS.map((level) => point[level])));

  const xForIndex = (index: number) =>
    padding.left + (data.length <= 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
  const yForValue = (value: number) =>
    padding.top + plotHeight - (value / maxValue) * plotHeight;

  return (
    <div className="rounded-lg border bg-background p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Daily activity</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Counts are grouped by the day each log was last seen.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((level) => (
            <Badge key={level} variant={LEVEL_META[level].badge}>
              {level}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg
          aria-label="Daily logs by level"
          className="min-w-[640px]"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
        >
          <line
            stroke="currentColor"
            strokeOpacity="0.18"
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + plotHeight}
            y2={padding.top + plotHeight}
          />
          {[0.5, 1].map((ratio) => (
            <line
              key={ratio}
              stroke="currentColor"
              strokeOpacity="0.08"
              x1={padding.left}
              x2={width - padding.right}
              y1={padding.top + plotHeight - plotHeight * ratio}
              y2={padding.top + plotHeight - plotHeight * ratio}
            />
          ))}
          {LEVELS.map((level) => (
            <polyline
              fill="none"
              key={level}
              points={data
                .map((point, index) => `${xForIndex(index)},${yForValue(point[level])}`)
                .join(" ")}
              stroke={LEVEL_META[level].color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          ))}
          {data.map((point, index) => (
            <g key={point.day}>
              <text
                fill="currentColor"
                fontSize="11"
                opacity="0.65"
                textAnchor="middle"
                x={xForIndex(index)}
                y={height - 12}
              >
                {formatChartDay(point.day)}
              </text>
              {LEVELS.map((level) => (
                <circle
                  cx={xForIndex(index)}
                  cy={yForValue(point[level])}
                  fill={LEVEL_META[level].color}
                  key={level}
                  r="3"
                />
              ))}
            </g>
          ))}
          <text
            fill="currentColor"
            fontSize="11"
            opacity="0.65"
            textAnchor="end"
            x={padding.left - 8}
            y={padding.top + 4}
          >
            {maxValue}
          </text>
          <text
            fill="currentColor"
            fontSize="11"
            opacity="0.65"
            textAnchor="end"
            x={padding.left - 8}
            y={padding.top + plotHeight + 4}
          >
            0
          </text>
        </svg>
      </div>
      {data.length === 0 ? (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          No daily log activity yet.
        </p>
      ) : null}
    </div>
  );
}

function LogHighlights({
  latestLog,
  topLog,
}: {
  latestLog: ApplicationLog | null;
  topLog: ApplicationLog | null;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <LogHighlight title="Latest log" log={latestLog} detail="Last occurrence" />
      <LogHighlight title="Most frequent log" log={topLog} detail="Occurrences" />
    </div>
  );
}

function LogHighlight({
  title,
  log,
  detail,
}: {
  title: string;
  log: ApplicationLog | null;
  detail: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {log ? <Badge variant={LEVEL_META[log.level].badge}>{log.level}</Badge> : null}
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {log?.message ?? "No logs yet."}
      </p>
      {log ? (
        <p className="mt-2 text-sm text-foreground">
          {detail}:{" "}
          {detail === "Occurrences" ? `${log.count}x` : formatDateTime(log.updatedAt)}
        </p>
      ) : null}
    </div>
  );
}

function formatChartDay(day: string) {
  const date = new Date(`${day}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return day;
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}
