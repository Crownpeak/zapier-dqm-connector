const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('creates.getAssetDetails', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';
  const assetId = 'babeef81579bf9c349ff4f4b702844e3';
  const invalidAssetId = 'invalid_asset_id';

  const mockResponse = {
    "websiteId": "12345",
    "contentType": "text/html;charset=\"UTF-8\"",
    "expires": "2025-09-16T07:58:20Z",
    "id": "babeef81579bf9c349ff4f4b702844e3",
    "created": "2025-09-16T07:28:20Z",
    "modified": "2025-09-16T07:28:20Z"
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

  it('should return details for given asset', async () => {
    nock(baseUrl)
        .get(`/assets/${assetId}`)
        .query({ apiKey, websiteId })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, mockResponse);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId }
    };

    const result = await appTester(App.creates.getAssetDetails.operation.perform, bundle);

    expect(result).toBeDefined();
    expect(result).toEqual(mockResponse);
  });

  it('should throw MissingField when assetId is not provided', async () => {
    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: {}
    };

    await expect(
        appTester(App.creates.getAssetDetails.operation.perform, bundle)
    ).rejects.toThrow("Asset ID is required");
  });

  it('should return 404 for invalid assetId', async () => {
    const apiErrorBody = {
      statusCode: 404,
      message: 'No asset resource exists with identifier [invalid_asset_id]',
    };

    nock(baseUrl)
        .get(`/assets/${invalidAssetId}`)
        .query({ apiKey, websiteId })
        .reply(404, apiErrorBody, { 'Content-Type': 'application/json' });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId: invalidAssetId }
    };

    try {
      await appTester(App.creates.getAssetDetails.operation.perform, bundle);
    } catch (error) {
      const parsedError = JSON.parse(error.message);
      expect(parsedError.status).toBe(404);
      const body = JSON.parse(parsedError.content);
      expect(body).toMatchObject(apiErrorBody);
    }
  });
});