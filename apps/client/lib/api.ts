import type {
  ApiErrorPayload,
  ApiResponse,
  Application,
  Developer,
  LoginPayload,
  LogsQuery,
  LogsResponse,
  RegisterPayload,
} from "@/lib/types";

const DEFAULT_API_BASE_URL = "http://localhost:5000";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const buildUrl = (path: string, query?: Record<string, string | number>) => {
  const url = new URL(path, API_BASE_URL);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...init } = options;

  const response = await fetch(buildUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | ApiErrorPayload
    | null;

  if (!response.ok) {
    const message =
      payload && "message" in payload ? payload.message : "Request failed";
    const errorPayload =
      payload && "message" in payload ? payload : undefined;

    throw new ApiError(message, response.status, errorPayload);
  }

  if (!payload || !("data" in payload)) {
    return undefined as T;
  }

  return payload.data;
}

export const api = {
  login: (payload: LoginPayload) =>
    apiRequest<{ developer: Developer; token: string }>("/api/users/login", {
      method: "POST",
      body: payload,
    }),
  register: (payload: RegisterPayload) =>
    apiRequest<{ developer: Developer; token: string }>("/api/users/register", {
      method: "POST",
      body: payload,
    }),
  logout: () =>
    apiRequest<void>("/api/users/logout", {
      method: "POST",
    }),
  applications: () => apiRequest<Application[]>("/api/applications"),
  application: (name: string) =>
    apiRequest<Application>(`/api/applications/${encodeURIComponent(name)}`),
  logs: (applicationName: string, query: LogsQuery = {}) => {
    const searchParams = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      sortBy: query.sortBy ?? "updatedAt",
      sortOrder: query.sortOrder ?? "desc",
      level: query.level ?? "",
      search: query.search ?? "",
    };

    return apiRequest<LogsResponse>(
      buildUrl(
        `/api/applications/${encodeURIComponent(applicationName)}/logs`,
        searchParams,
      ).replace(API_BASE_URL, ""),
    );
  },
};
