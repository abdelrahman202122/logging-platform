export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'info' | 'warn' | 'error';

export type InitConfig = {
  apiKey: string;
  applicationName: string;
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type LogPayload = {
  message: string;
  level: LogLevel;
};

export class LoggingPlatformError extends Error {
  status?: number;
  response?: unknown;
}

export class LoggingPlatformClient {
  constructor(config: InitConfig);
  log(payload: LogPayload): Promise<unknown>;
}

export function init(config: InitConfig): LoggingPlatformClient;
export function log(payload: LogPayload): Promise<unknown>;
export function createClient(config: InitConfig): LoggingPlatformClient;
