export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorPayload = {
  success?: false;
  status?: string;
  message: string;
};

export type Developer = {
  id: string;
  username: string;
  email: string;
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
};

export type Application = {
  _id: string;
  name: string;
  developer: string;
  createdAt: string;
  updatedAt: string;
};

export type LogLevel = "INFO" | "WARN" | "ERROR";

export type ApplicationLog = {
  _id: string;
  application: string;
  message: string;
  level: LogLevel;
  count: number;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type LogsResponse = {
  logs: ApplicationLog[];
  pagination: Pagination;
};

export type LogLevelCount = {
  _id: LogLevel;
  count: number;
  uniqueLogs: number;
};

export type DailyLogCount = {
  day: string;
  level: LogLevel;
  count: number;
};

export type LogsSummary = {
  levelCounts: LogLevelCount[];
  dailyCounts: DailyLogCount[];
  totals: {
    totalEvents: number;
    uniqueLogs: number;
  };
  latestLog: ApplicationLog | null;
  topLog: ApplicationLog | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  username: string;
};

export type LogsQuery = {
  page?: number;
  limit?: number;
  sortBy?: "updatedAt" | "count";
  sortOrder?: "asc" | "desc";
  level?: LogLevel | "";
  search?: string;
};
