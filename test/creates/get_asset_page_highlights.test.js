const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('creates.getAssetPageHighlights', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';
  const assetId = 'babeef81579bf9c349ff4f4b702844e3';
  const invalidAssetId = 'invalid_asset_id';

  const mockResponse = '<html><head><title>Test Page</title></head><body><h1>Test Page</h1><p>A <b data-dqm-id="8b4a74ba8420d8766021675cac9d4e24" style="background:yellow;border:2px solid #ff0000">&nbsp;bold tag error</b> and image tag <img data-dqm-id="a057e0c4fba8494a728d688b662b4881" style="border:2px solid #ff0000"  href=""/> with missing alt attribute.</p></body></html>';

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    if (!nock.isDone()) {
      console.error('Pending mocks: %j', nock.pendingMocks());
      throw new Error('Not all nock interceptors were used!');
    }
  });

  it('should return pagehighlight issues for given asset', async () => {
    nock(baseUrl)
        .get(`/assets/${assetId}/pagehighlight/all`)
        .query({ apiKey, websiteId })
        .matchHeader('Accept', 'text/html; charset=UTF-8')
        .reply(200, mockResponse);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId }
    };

    const result = await appTester(App.creates.getAssetPageHighlights.operation.perform, bundle);

    expect(result).toBeDefined();
    expect(result).toEqual({ content: mockResponse });
  });

  it('should throw MissingField when assetId is not provided', async () => {
    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: {}
    };

    await expect(
        appTester(App.creates.getAssetPageHighlights.operation.perform, bundle)
    ).rejects.toThrow("Asset ID is required");
  });

  it('should return 404 for invalid assetId', async () => {
    const apiErrorBody = {
      statusCode: 404,
      message: 'No asset resource exists with identifier [invalid_asset_id]',
    };

    nock(baseUrl)
        .get(`/assets/${invalidAssetId}/pagehighlight/all`)
        .query({ apiKey, websiteId })
        .matchHeader('Accept', 'text/html; charset=UTF-8')
        .reply(404, apiErrorBody, { 'Content-Type': 'application/json' });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId: invalidAssetId }
    };

    try {
      await appTester(App.creates.getAssetPageHighlights.operation.perform, bundle);
    } catch (error) {
      const parsedError = JSON.parse(error.message);
      expect(parsedError.status).toBe(404);
      const body = JSON.parse(parsedError.content);
      expect(body).toMatchObject(apiErrorBody);
    }
  });
});