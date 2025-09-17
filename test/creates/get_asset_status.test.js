const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('creates.getAssetStatus', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';
  const assetId = 'babeef81579bf9c349ff4f4b702844e3';
  const invalidAssetId = 'invalid_asset_id';

  const mockResponse = {
    "assetId": "babeef81579bf9c349ff4f4b702844e3",
    "created": "2025-09-16T07:28:38Z",
    "siteName": "example.com",
    "totalCheckpoints": 2,
    "totalErrors": 0,
    "checkpoints": [
      {
        "failed": false,
        "canHighlight": {
          "page": true,
          "source": true
        },
        "name": "Always write the company name correctly",
        "priority": false,
        "reference": "0.1",
        "number": 1,
        "categoryNumber": 0,
        "category": "Brand",
        "description": "Checks the correct capitalization of your company, product or website name.",
        "topics": [
          "Brand"
        ],
        "restricted": false,
        "id": "8fbab9709548822151ea9649bb784766",
        "created": "2025-07-02T09:44:50Z",
        "modified": "2025-07-02T09:46:38Z"
      },
      {
        "failed": false,
        "canHighlight": {
          "page": false,
          "source": false
        },
        "name": "All pages should contain headings",
        "priority": false,
        "reference": "1.1",
        "number": 1,
        "categoryNumber": 1,
        "category": "Content presentation",
        "description": "Using HTML heading tags to indicate page structure is helpful for users of assistive technologies and for SEO.",
        "topics": [
          "SEO",
          "Accessibility"
        ],
        "restricted": false,
        "id": "a96a99fb2b95321fb0675637120f4d1d",
        "created": "2025-07-02T09:44:50Z",
        "modified": "2025-07-02T09:44:50Z"
      },
    ],
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

  it('should return status and collection of failed or passed checkpoints for given asset', async () => {
    nock(baseUrl)
        .get(`/assets/${assetId}/status`)
        .query({ apiKey, websiteId })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, mockResponse);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId }
    };

    const result = await appTester(App.creates.getAssetStatus.operation.perform, bundle);

    expect(result).toBeDefined();
    expect(result).toEqual(mockResponse);
  });

  it('should throw MissingField when assetId is not provided', async () => {
    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: {}
    };

    await expect(
        appTester(App.creates.getAssetStatus.operation.perform, bundle)
    ).rejects.toThrow("Asset ID is required");
  });

  it('should return 404 for invalid assetId', async () => {
    const apiErrorBody = {
      statusCode: 404,
      message: 'No asset resource exists with identifier [invalid_asset_id]',
    };

    nock(baseUrl)
        .get(`/assets/${invalidAssetId}/status`)
        .query({ apiKey, websiteId })
        .reply(404, apiErrorBody, { 'Content-Type': 'application/json' });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { assetId: invalidAssetId }
    };

    try {
      await appTester(App.creates.getAssetStatus.operation.perform, bundle);
    } catch (error) {
      const parsedError = JSON.parse(error.message);
      expect(parsedError.status).toBe(404);
      const body = JSON.parse(parsedError.content);
      expect(body).toMatchObject(apiErrorBody);
    }
  });
});