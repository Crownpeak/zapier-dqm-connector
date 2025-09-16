const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('creates.getWebsiteDetails', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';

  const mockResponse = {
    "name": "example.com",
    "id": "a1b2c3d4e5f60718293a4b5c6d7e8f90",
    "created": "2025-07-02T09:45:31Z",
    "modified": "2025-07-02T10:20:25Z"
  }

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    if (!nock.isDone()) {
      console.error('Pending mocks: %j', nock.pendingMocks());
      throw new Error('Not all nock interceptors were used!');
    }
  });

  it('should retrieve details of given website', async () => {
    nock(baseUrl)
        .get(`/websites/${websiteId}`)
        .query({ apiKey })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, mockResponse);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { websiteId }
    };

    const result = await appTester(App.creates.getWebsiteDetails.operation.perform, bundle);

    expect(result).toBeDefined();
    expect(result).toEqual(mockResponse);
  });

  it('should throw MissingField when websiteId is not provided', async () => {
    const bundle = {
      authData: { apiKey, baseUrl },
      inputData: {}
    };

    await expect(
        appTester(App.creates.getWebsiteDetails.operation.perform, bundle)
    ).rejects.toThrow("Website ID is required");
  });
});