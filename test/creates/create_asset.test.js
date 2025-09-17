const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('creates.createAsset', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';
  const content = '<html><head><title>Test Page</title></head><body><h1>Test Page</h1><p>A <b>bold tag error</b> and image tag <img href=""/> with missing alt attribute.</p></body></html>';
  const contentType = 'text/html; charset=UTF-8';

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

  it('should create new asset', async () => {
    nock(baseUrl)
        .post(`/assets`, body => {
          const params = new URLSearchParams(body);
          expect(params.get('websiteId')).toBe(websiteId);
          expect(params.get('content')).toBe(content);
          expect(params.get('contentType')).toBe(contentType);
          return true;
        })
        .query({ apiKey })
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .reply(201, mockResponse, { 'Content-Type': 'application/json' });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { content, contentType }
    };

    const result = await appTester(App.creates.createAsset.operation.perform, bundle);

    expect(result).toEqual(mockResponse);
  });
});
