const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('creates.getAssetErrorsByCheckpoint', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';
  const assetId = 'babeef81579bf9c349ff4f4b702844e3';
  const invalidAssetId = 'invalid_asset_id';
  const checkpointId = 'a057e0c4fba8494a728d688b662b4881';
  const invalidCheckpointId = 'invalid_checkpoint_id';

  const mockResponse = '<html><head><title>Test Page</title></head><body><h1>Test Page</h1><p>A <b>bold tag error</b> and image tag <img style="border : 2px solid red"  href=""/> with missing alt attribute.</p></body></html>';

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    if (!nock.isDone()) {
      console.error('Pending mocks: %j', nock.pendingMocks());
      throw new Error('Not all nock interceptors were used!');
    }
  });

  it('should return asset content issues for given checkpoint', async () => {
    nock(baseUrl)
        .get(`/assets/${assetId}/errors/${checkpointId}`)
        .query({ apiKey, websiteId })
        .matchHeader('Accept', 'text/html; charset=UTF-8')
        .reply(200, mockResponse);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId, checkpointId }
    };

    const result = await appTester(App.creates.getAssetErrorsByCheckpoint.operation.perform, bundle);

    expect(result).toBeDefined();
    expect(result).toEqual({ content: mockResponse });
  });

  it('should throw MissingField when assetId is not provided', async () => {
    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: {}
    };

    await expect(
        appTester(App.creates.getAssetErrorsByCheckpoint.operation.perform, bundle)
    ).rejects.toThrow("Asset ID is required");
  });

  it('should return 404 for invalid assetId', async () => {
    const apiErrorBody = {
      statusCode: 404,
      message: 'No asset resource exists with identifier [invalid_asset_id]',
    };

    nock(baseUrl)
        .get(`/assets/${invalidAssetId}/errors/${checkpointId}`)
        .query({ apiKey, websiteId })
        .matchHeader('Accept', 'text/html; charset=UTF-8')
        .reply(404, apiErrorBody, { 'Content-Type': 'application/json' });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId: invalidAssetId, checkpointId }
    };

    try {
      await appTester(App.creates.getAssetErrorsByCheckpoint.operation.perform, bundle);
    } catch (error) {
      const parsedError = JSON.parse(error.message);
      expect(parsedError.status).toBe(404);
      const body = JSON.parse(parsedError.content);
      expect(body).toMatchObject(apiErrorBody);
    }
  });

  it('should return 404 for invalid checkpointId', async () => {
    const apiErrorBody = {
      statusCode: 404,
      message: 'No asset resource exists with identifier [invalid_checkpoint_id]',
    };

    nock(baseUrl)
        .get(`/assets/${assetId}/errors/${invalidCheckpointId}`)
        .query({ apiKey, websiteId })
        .matchHeader('Accept', 'text/html; charset=UTF-8')
        .reply(404, apiErrorBody, { 'Content-Type': 'application/json' });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId, checkpointId: invalidCheckpointId }
    };

    try {
      await appTester(App.creates.getAssetErrorsByCheckpoint.operation.perform, bundle);
    } catch (error) {
      const parsedError = JSON.parse(error.message);
      expect(parsedError.status).toBe(404);
      const body = JSON.parse(parsedError.content);
      expect(body).toMatchObject(apiErrorBody);
    }
  });
});