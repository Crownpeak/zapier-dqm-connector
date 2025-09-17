const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('searches.getWebsiteCheckpoints', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';

  const mockResponse = [
    {
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
      "id": "a1b2c3d4e5f60718293a4b5c6d7e8f90",
      "created": "2025-07-02T09:44:50Z",
      "modified": "2025-07-02T09:44:50Z"
    },
  ];

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    if (!nock.isDone()) {
      console.error('Pending mocks: %j', nock.pendingMocks());
      throw new Error('Not all nock interceptors were used!');
    }
  });

  it('should retrieve checkpoints for given website', async () => {
    nock(baseUrl)
        .get(`/websites/${websiteId}/checkpoints`)
        .query({ apiKey })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, mockResponse);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { websiteId }
    };

    const result = await appTester(App.searches.getWebsiteCheckpoints.operation.perform, bundle);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result).toEqual(mockResponse);
  });

  it('should return an empty array when no checkpoints for given website are found', async () => {
    nock(baseUrl)
        .get(`/websites/${websiteId}/checkpoints`)
        .query({ apiKey })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, []);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { websiteId}
    };

    const result = await appTester(App.searches.getWebsiteCheckpoints.operation.perform, bundle);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('should throw MissingField error when websiteId is not provided', async () => {
    const bundle = {
      authData: { apiKey, baseUrl },
      inputData: {}
    };

    await expect(
        appTester(App.searches.getWebsiteCheckpoints.operation.perform, bundle)
    ).rejects.toThrow("Website ID is required");
  });
});