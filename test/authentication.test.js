/* globals describe, it, beforeEach, afterEach, expect */

const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../index');

const appTester = zapier.createAppTester(App);

describe('custom auth', () => {
  beforeEach(() => {
    // Clean all interceptors before each test
    nock.cleanAll();
  });

  afterEach(() => {
    // Ensure all nock interceptors were used
    if (!nock.isDone()) {
      console.error('Pending mocks: %j', nock.pendingMocks());
      throw new Error('Not all nock interceptors were used!');
    }
  });

  it('passes authentication and returns json', async () => {
    nock('https://api.crownpeak.net')
        .get('/dqm-cms/v1/some-test-endpoint')
        .query({ api_key: 'secret' })
        .reply(200, { status: 'ok', user: 'test-user' });

    const bundle = {
      authData: {
        apiKey: 'secret',
        websiteId: '12345',
        baseUrl: 'https://api.crownpeak.net/dqm-cms/v1',
      },
    };

    const response = await appTester(App.authentication.test, bundle);
    expect(response.data.status).toBe('ok');
    expect(response.data.user).toBe('test-user');
  });

  it('fails on bad auth', async () => {
    nock('https://api.crownpeak.net')
        .get('/dqm-cms/v1/some-test-endpoint')
        .query({ api_key: 'bad' })
        .reply(401, { message: 'The API Key you supplied is incorrect' });

    const bundle = {
      authData: {
        apiKey: 'bad',
        websiteId: '12345',
        baseUrl: 'https://api.crownpeak.net/dqm-cms/v1',
      },
    };

    try {
      await appTester(App.authentication.test, bundle);
    } catch (error) {
      expect(error.message).toContain('The API Key you supplied is incorrect');
      return;
    }
    throw new Error('appTester should have thrown');
  });
});
