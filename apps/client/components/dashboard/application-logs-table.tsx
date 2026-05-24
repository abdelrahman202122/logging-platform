"use client";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { api, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/date";
import type {
  ApplicationLog,
  LogLevel,
  LogsQuery,
  LogsResponse,
  Pagination,
} from "@/lib/types";

type SortMode = "recent" | "count";

type ApplicationLogsTableProps = {
  applicationName: string;
};

const PAGE_SIZE = 10;

const levelVariant: Record<LogLevel, "default" | "secondary" | "destructive"> =
  {
    INFO: "secondary",
    WARN: "default",
    ERROR: "destructive",
  };

const initialPagination: Pagination = {
  total: 0,
  page: 1,
  limit: PAGE_SIZE,
  pages: 0,
};

export function ApplicationLogsTable({
  applicationName,
}: ApplicationLogsTableProps) {
  const [logs, setLogs] = React.useState<ApplicationLog[]>([]);
  const [pagination, setPagination] =
    React.useState<Pagination>(initialPagination);
  const [page, setPage] = React.useState(1);
  const [sortMode, setSortMode] = React.useState<SortMode>("recent");
  const [level, setLevel] = React.useState<LogLevel | "">("");
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const query = React.useMemo<LogsQuery>(
    () => ({
      page,
      limit: PAGE_SIZE,
      sortBy: sortMode === "recent" ? "updatedAt" : "count",
      sortOrder: "desc",
      level,
      search,
    }),
    [level, page, search, sortMode],
  );

  const applyResponse = React.useCallback((response: LogsResponse) => {
    setLogs(response.logs);
    setPagination(response.pagination);
  }, []);

  React.useEffect(() => {
    let isActive = true;

    const loadLogs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.logs(applicationName, query);
        if (!isActive) {
          return;
        }
        applyResponse(response);
      } catch (loadError) {
        if (!isActive) {
          return;
        }
        setError(
          loadError instanceof ApiError
            ? loadError.message
            : "Unable to load logs.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadLogs();

    return () => {
      isActive = false;
    };
  }, [applicationName, applyResponse, query]);

  const refreshLogs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.logs(applicationName, query);
      applyResponse(response);
    } catch (refreshError) {
      setError(
        refreshError instanceof ApiError
          ? refreshError.message
          : "Unable to load logs.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateSortMode = (value: SortMode) => {
    setSortMode(value);
    setPage(1);
  };

  const updateLevel = (value: LogLevel | "") => {
    setLevel(value);
    setPage(1);
  };

  const applySearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Logs</CardTitle>
            <CardDescription>
              Showing 10 logs per page, sorted by most recent by default.
            </CardDescription>
          </div>
          <Button
            disabled={isLoading}
            onClick={() => void refreshLogs()}
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
        <div className="grid gap-3 lg:grid-cols-[1fr_190px_170px]">
          <form className="flex gap-2" onSubmit={applySearch}>
            <div className="min-w-0 flex-1">
              <Label className="sr-only" htmlFor="log-search">
                Search log messages
              </Label>
              <Input
                id="log-search"
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search log messages"
                value={searchInput}
              />
            </div>
            <Button type="submit" variant="outline">
              <Search />
              Search
            </Button>
            {search ? (
              <Button onClick={clearSearch} type="button" variant="ghost">
                Clear
              </Button>
            ) : null}
          </form>

          <div>
            <Label className="sr-only" htmlFor="level-filter">
              Level
            </Label>
            <Select
              id="level-filter"
              onChange={(event) => updateLevel(event.target.value as LogLevel | "")}
              value={level}
            >
              <option value="">All levels</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warn</option>
              <option value="ERROR">Error</option>
            </Select>
          </div>

          <div>
            <Label className="sr-only" htmlFor="sort-mode">
              Sort
            </Label>
            <Select
              id="sort-mode"
              onChange={(event) => updateSortMode(event.target.value as SortMode)}
              value={sortMode}
            >
              <option value="recent">Most recent</option>
              <option value="count">Most occurred</option>
            </Select>
          </div>
        </div>

        {error ? (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b bg-muted/60 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Message</th>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 text-right font-medium">Count</th>
                  <th className="px-4 py-3 font-medium">First occurrence</th>
                  <th className="px-4 py-3 font-medium">Last occurrence</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td className="px-4 py-8 text-muted-foreground" colSpan={5}>
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Loading logs
                      </span>
                    </td>
                  </tr>
                ) : null}

                {!isLoading && logs.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-8 text-center text-muted-foreground"
                      colSpan={5}
                    >
                      No logs match the current filters.
                    </td>
                  </tr>
                ) : null}

                {!isLoading
                  ? logs.map((log) => <LogRow key={log._id} log={log} />)
                  : null}
              </tbody>
            </table>
          </div>
        </div>

        <PaginationControls
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
}

function LogRow({ log }: { log: ApplicationLog }) {
  return (
    <tr>
      <td className="max-w-[420px] px-4 py-3 text-foreground">
        <span className="line-clamp-2 break-words">{log.message}</span>
      </td>
      <td className="px-4 py-3">
        <Badge variant={levelVariant[log.level]}>{log.level}</Badge>
      </td>
      <td className="px-4 py-3 text-right font-medium text-foreground">
        {log.count}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {formatDateTime(log.createdAt)}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {formatDateTime(log.updatedAt)}
      </td>
    </tr>
  );
}

type PaginationControlsProps = {
  isLoading: boolean;
  pagination: Pagination;
  onPageChange: (page: number) => void;
};

function PaginationControls({
  isLoading,
  pagination,
  onPageChange,
}: PaginationControlsProps) {
  const hasPrevious = pagination.page > 1;
  const hasNext = pagination.page < pagination.pages;
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}-{end} of {pagination.total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          disabled={isLoading || !hasPrevious}
          onClick={() => onPageChange(pagination.page - 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          <ChevronLeft />
          Previous
        </Button>
        <span className="min-w-20 text-center text-sm text-muted-foreground">
          Page {pagination.page} of {Math.max(pagination.pages, 1)}
        </span>
        <Button
          disabled={isLoading || !hasNext}
          onClick={() => onPageChange(pagination.page + 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
