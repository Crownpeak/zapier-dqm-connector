const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('creates.updateAsset', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';
  const assetId = '88f609de5d9a16055201465ff21b48ed';
  const invalidAssetId = 'invalid_asset_id';
  const content = '<html><head><title>Modified Test Page</title></head><body><h1>Modified Test Page</h1><p>A <strong>bold tag error fixed</strong> and image tag <img href="" alt="explains the image" /> with alt attribute added.</p></body></html>';

  const mockResponse = {
    "websiteId": "aa0d234380441a02a1856051a0c34d44",
    "contentType": "text/html;charset=\"UTF-8\"",
    "expires": "2025-09-16T14:33:04Z",
    "id": "88f609de5d9a16055201465ff21b48ed",
    "created": "2025-09-16T14:03:04Z",
    "modified": "2025-09-16T14:03:04Z"
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

  it('should update existing asset', async () => {
    nock(baseUrl)
        .put(`/assets/${assetId}`, body => {
          const params = new URLSearchParams(body);
          expect(params.get('websiteId')).toBe(websiteId);
          expect(params.get('content')).toBe(content);
          return true;
        })
        .query({ apiKey })
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .reply(201, mockResponse, { 'Content-Type': 'application/json' });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { content, assetId }
    };

    const result = await appTester(App.creates.updateAsset.operation.perform, bundle);

    expect(result).toEqual(mockResponse);
  });

  it('should throw MissingField when assetId is not provided', async () => {
    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: {}
    };

    await expect(
        appTester(App.creates.updateAsset.operation.perform, bundle)
    ).rejects.toThrow("Asset ID is required");
  });

  it('should return 404 for invalid assetId', async () => {
    const apiErrorBody = {
      statusCode: 404,
      message: 'No asset resource exists with identifier [invalid_asset_id]',
    };

    nock(baseUrl)
        .put(`/assets/${invalidAssetId}`)
        .query({ apiKey })
        .reply(404, apiErrorBody, { 'Content-Type': 'application/json' });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId: invalidAssetId, content }
    };

    try {
      await appTester(App.creates.updateAsset.operation.perform, bundle);
    } catch (error) {
      const parsedError = JSON.parse(error.message);
      expect(parsedError.status).toBe(404);
      const body = JSON.parse(parsedError.content);
      expect(body).toMatchObject(apiErrorBody);
    }
  });
});