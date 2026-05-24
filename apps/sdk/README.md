# Logging Platform Server SDK

Server-side SDK for sending logs to the Logging Platform API.

## Install

```bash
npm install logging-platform-server-sdk
```

## Usage

```js
const loggingPlatform = require('logging-platform-server-sdk');

loggingPlatform.init({
  apiKey: process.env.LOGGING_PLATFORM_API_KEY,
  applicationName: 'billing-service',
  baseUrl: 'https://your-logging-api.example.com',
});

await loggingPlatform.log({
  level: 'ERROR',
  message: 'Payment authorization failed',
});
```

You can also create isolated clients:

```js
const { createClient } = require('logging-platform-server-sdk');

const logger = createClient({
  apiKey: process.env.LOGGING_PLATFORM_API_KEY,
  applicationName: 'billing-service',
});

await logger.log({ level: 'INFO', message: 'Service started' });
```

## API

### `init(config)`

Stores a default SDK client.

```js
init({
  apiKey: 'developer-api-key',
  applicationName: 'unique-application-name',
  baseUrl: 'http://localhost:5000',
});
```

### `log(payload)`

Sends a log through the default SDK client.

```js
await log({
  level: 'WARN',
  message: 'Queue latency is high',
});
```

Supported levels are `INFO`, `WARN`, and `ERROR`.

## Ownership Validation

The SDK sends the API key in the `x-api-key` header and the application name in
the request path. The backend validates both together: it first resolves the
developer by API key, then only accepts the log if the application belongs to
that same developer.
