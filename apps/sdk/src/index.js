'use strict';

const DEFAULT_BASE_URL = 'http://localhost:5000';
const LOG_LEVELS = new Set(['INFO', 'WARN', 'ERROR']);

let activeClient = null;

class LoggingPlatformError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'LoggingPlatformError';
    this.status = options.status;
    this.response = options.response;
  }
}

const assertNonEmptyString = (value, fieldName) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new LoggingPlatformError(`${fieldName} is required`);
  }
};

const normalizeLevel = (level) => {
  assertNonEmptyString(level, 'level');

  const normalizedLevel = level.toUpperCase();
  if (!LOG_LEVELS.has(normalizedLevel)) {
    throw new LoggingPlatformError('level must be one of: INFO, WARN, ERROR');
  }

  return normalizedLevel;
};

const normalizeBaseUrl = (baseUrl) => {
  assertNonEmptyString(baseUrl, 'baseUrl');
  return baseUrl.replace(/\/+$/, '');
};

const createLogUrl = (baseUrl, applicationName) =>
  `${baseUrl}/api/applications/${encodeURIComponent(applicationName)}/logs`;

const parseResponseBody = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

class LoggingPlatformClient {
  constructor(config) {
    assertNonEmptyString(config.apiKey, 'apiKey');
    assertNonEmptyString(config.applicationName, 'applicationName');

    this.apiKey = config.apiKey.trim();
    this.applicationName = config.applicationName.trim();
    this.baseUrl = normalizeBaseUrl(config.baseUrl || DEFAULT_BASE_URL);
    this.fetchImpl = config.fetch || globalThis.fetch;

    if (typeof this.fetchImpl !== 'function') {
      throw new LoggingPlatformError(
        'fetch is required. Use Node.js 18+ or pass a fetch implementation.',
      );
    }
  }

  async log(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new LoggingPlatformError('log payload is required');
    }

    assertNonEmptyString(payload.message, 'message');

    const response = await this.fetchImpl(
      createLogUrl(this.baseUrl, this.applicationName),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          message: payload.message,
          level: normalizeLevel(payload.level),
        }),
      },
    );

    const body = await parseResponseBody(response);

    if (!response.ok) {
      const message =
        body && typeof body === 'object' && body.message
          ? body.message
          : 'Failed to send log';

      throw new LoggingPlatformError(message, {
        status: response.status,
        response: body,
      });
    }

    return body && typeof body === 'object' && 'data' in body
      ? body.data
      : body;
  }
}

const init = (config) => {
  activeClient = new LoggingPlatformClient(config);
  return activeClient;
};

const log = (payload) => {
  if (!activeClient) {
    throw new LoggingPlatformError(
      'SDK is not initialized. Call init({ apiKey, applicationName }) first.',
    );
  }

  return activeClient.log(payload);
};

const createClient = (config) => new LoggingPlatformClient(config);

module.exports = {
  LoggingPlatformClient,
  LoggingPlatformError,
  createClient,
  init,
  log,
};
