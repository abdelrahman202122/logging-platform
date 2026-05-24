'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  LoggingPlatformError,
  createClient,
  init,
  log,
} = require('../src');

const createResponse = (body, options = {}) => ({
  ok: options.ok ?? true,
  status: options.status ?? 200,
  text: async () => JSON.stringify(body),
});

test('init stores a client used by log', async () => {
  let request;

  init({
    apiKey: 'test-key',
    applicationName: 'billing-api',
    baseUrl: 'https://logs.example.com/',
    fetch: async (url, options) => {
      request = { url, options };
      return createResponse({ success: true, data: { id: 'log-id' } });
    },
  });

  const result = await log({ message: 'Payment failed', level: 'error' });

  assert.deepEqual(result, { id: 'log-id' });
  assert.equal(
    request.url,
    'https://logs.example.com/api/applications/billing-api/logs',
  );
  assert.equal(request.options.headers['x-api-key'], 'test-key');
  assert.equal(
    request.options.body,
    JSON.stringify({ message: 'Payment failed', level: 'ERROR' }),
  );
});

test('createClient supports isolated clients', async () => {
  const client = createClient({
    apiKey: 'other-key',
    applicationName: 'inventory api',
    fetch: async (url) => {
      assert.equal(
        url,
        'http://localhost:5000/api/applications/inventory%20api/logs',
      );
      return createResponse({ success: true, data: { count: 1 } });
    },
  });

  assert.deepEqual(await client.log({ message: 'Stock low', level: 'WARN' }), {
    count: 1,
  });
});

test('log validates allowed levels before sending', async () => {
  const client = createClient({
    apiKey: 'key',
    applicationName: 'app',
    fetch: async () => {
      throw new Error('fetch should not be called');
    },
  });

  await assert.rejects(
    () => client.log({ message: 'Debug message', level: 'DEBUG' }),
    LoggingPlatformError,
  );
});

test('log surfaces API authorization failures', async () => {
  const client = createClient({
    apiKey: 'wrong-key',
    applicationName: 'foreign-app',
    fetch: async () =>
      createResponse(
        { success: false, message: 'Application not found' },
        { ok: false, status: 404 },
      ),
  });

  await assert.rejects(
    () => client.log({ message: 'Payment failed', level: 'ERROR' }),
    (error) =>
      error instanceof LoggingPlatformError &&
      error.status === 404 &&
      error.message === 'Application not found',
  );
});
