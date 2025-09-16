const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('creates.listAssets', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';

  const mockResponse = {
    total: 3,
    assets: [
      {
        websiteId: "12345",
        contentType: "text/html;charset=\"UTF-8\"",
        expires: "2025-09-15T16:42:55Z",
        id: "83d7bd9ef327e541a1f398a3306f42c6",
        created: "2025-09-15T16:12:55Z",
        modified: "2025-09-15T16:12:55Z"
      },
      {
        websiteId: "12345",
        contentType: "text/html;charset=\"UTF-8\"",
        expires: "2025-09-15T16:42:46Z",
        id: "8fbab9709548822151ea9649bb784766",
        created: "2025-09-15T16:12:46Z",
        modified: "2025-09-15T16:12:46Z"
      },
      {
        websiteId: "12345",
        contentType: "application/json",
        expires: "2025-09-15T16:42:46Z",
        id: "a1b2c3d4e5f60718293a4b5c6d7e8f90",
        created: "2025-09-15T16:12:46Z",
        modified: "2025-09-15T16:12:46Z"
      }
    ]
  };

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    if (!nock.isDone()) {
      console.error('Pending mocks: %j', nock.pendingMocks());
      throw new Error('Not all nock interceptors were used!');
    }
  });

  it('should retrieve assets with default limit', async () => {
    nock(baseUrl)
        .get('/assets')
        .query({ apiKey, websiteId, limit: '50' })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, mockResponse);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: {}
    };

    const result = await appTester(App.creates.listAssets.operation.perform, bundle);

    expect(result.assets).toHaveLength(3);
    expect(result.total).toBe(mockResponse.total);
    expect(result.assets).toEqual(mockResponse.assets);
    expect(Array.isArray(result.assets)).toBe(true);
  });

  it('should retrieve assets with limit applied', async () => {
    nock(baseUrl)
        .get('/assets')
        .query({ apiKey, websiteId, limit: "1" })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, {
          total: mockResponse.assets.length,
          assets: mockResponse.assets.slice(0, 1)
        });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: {
        returnAll: false,
        limit: "1"
      }
    };

    const result = await appTester(App.creates.listAssets.operation.perform, bundle);

    expect(result.assets).toHaveLength(1);
    expect(result.assets[0]).toEqual(mockResponse.assets[0]);
  });

  it('should return an empty result when no assets are found', async () => {
    nock(baseUrl)
        .get('/assets')
        .query({ apiKey, websiteId, limit: '50' })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, { total: 0, assets: [] });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: {}
    };

    const result = await appTester(App.creates.listAssets.operation.perform, bundle);

    expect(result.total).toBe(0);
    expect(Array.isArray(result.assets)).toBe(true);
    expect(result.assets).toHaveLength(0);
  });
});
