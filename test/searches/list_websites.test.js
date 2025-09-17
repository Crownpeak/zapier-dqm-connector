const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('searches.listWebsites', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';

  const mockResponse = [
    {
      "name": "example.com",
      "id": "a1b2c3d4e5f60718293a4b5c6d7e8f90",
      "created": "2025-07-02T09:45:31Z",
      "modified": "2025-07-02T10:20:25Z"
    }
  ]

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    if (!nock.isDone()) {
      console.error('Pending mocks: %j', nock.pendingMocks());
      throw new Error('Not all nock interceptors were used!');
    }
  });

  it('should retrieve websites', async () => {
    nock(baseUrl)
        .get('/websites')
        .query({ apiKey })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, mockResponse);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: {}
    };

    const result = await appTester(App.searches.listWebsites.operation.perform, bundle);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result).toEqual(mockResponse);
  });

  it('should return an empty array when no websites are found', async () => {
    nock(baseUrl)
        .get('/websites')
        .query({ apiKey })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, []);

    const bundle = { authData: { apiKey, websiteId, baseUrl }, inputData: {} };

    const result = await appTester(App.searches.listWebsites.operation.perform, bundle);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});