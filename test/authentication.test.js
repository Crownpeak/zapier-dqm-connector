const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../index');

const appTester = zapier.createAppTester(App);

describe('Authentication', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    if (!nock.isDone()) {
      console.error('Pending mocks: %j', nock.pendingMocks());
      throw new Error('Not all nock interceptors were used!');
    }
  });

  it('successfully authenticates with valid credentials and returns json', async () => {
    nock('https://api.crownpeak.net/dqm-cms/v1')
        .get('/assets')
        .query({ apiKey: 'valid_api_key'})
        .matchHeader('Authorization', 'Bearer valid_api_key')
        .matchHeader('x-api-key', 'valid_api_key')
        .reply(200, {
          total: 0,
          assets: [],
        });

    const bundle = {
      authData: {
        apiKey: 'valid_api_key',
        websiteId: '12345',
        baseUrl: 'https://api.crownpeak.net/dqm-cms/v1',
      },
    };

    const response = await appTester(App.authentication.test, bundle);

    expect(response).toBeDefined();
    expect(response.data.total).toBe(0);
    expect(response.data.assets).toBeInstanceOf(Array);
  });

  it('fails to authenticate with invalid credentials', async () => {
    nock('https://api.crownpeak.net/dqm-cms/v1')
        .get('/assets')
        .query({ apiKey: 'invalid_api_key' })
        .matchHeader('Authorization', 'Bearer invalid_api_key')
        .matchHeader('x-api-key', 'invalid_api_key')
        .reply(403, {
          statusCode: 403,
          message: 'Authentication failure: invalid api key'
        });

    const bundle = {
      authData: {
        apiKey: 'invalid_api_key',
        websiteId: '12345',
        baseUrl: 'https://api.crownpeak.net/dqm-cms/v1',
      },
    };

    await expect(appTester(App.authentication.test, bundle))
        .rejects.toThrow("Authentication failure: invalid api key");
  });
});
