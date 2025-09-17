const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

describe('creates.getCheckpointDetails', () => {
  const apiKey = 'valid_api_key';
  const websiteId = '12345';
  const baseUrl = 'https://api.crownpeak.net/dqm-cms/v1';
  const checkpointId = '86169b8bf3dcbf91ee1719ee859a46a4';
  const invalidCheckpointId = 'invalid_checkpoint_id';

  const mockResponse = {
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
    "id": "86169b8bf3dcbf91ee1719ee859a46a4",
    "created": "2025-07-02T09:44:50Z",
    "modified": "2025-07-02T09:46:38Z"
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

  it('should retrieve details for given checkpoint', async () => {
    nock(baseUrl)
        .get(`/checkpoints/${checkpointId}`)
        .query({ apiKey })
        .matchHeader('Accept', 'application/json; charset=UTF-8')
        .reply(200, mockResponse);

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { checkpointId }
    };

    const result = await appTester(App.creates.getCheckpointDetails.operation.perform, bundle);

    expect(result).toBeDefined();
    expect(result).toEqual(mockResponse);
  });

    it('should throw MissingField when checkpointId is not provided', async () => {
        const bundle = {
        authData: { apiKey, baseUrl },
        inputData: {}
        };

        await expect(
            appTester(App.creates.getCheckpointDetails.operation.perform, bundle)
        ).rejects.toThrow("Checkpoint ID is required");
    });

  it('should return 404 for invalid checkpointId', async () => {
    const apiErrorBody = {
      statusCode: 404,
      message: 'No asset resource exists with identifier [invalid_checkpoint_id]',
    };

    nock(baseUrl)
        .get(`/checkpoints/${invalidCheckpointId}`)
        .query({ apiKey})
        .reply(404, apiErrorBody, { 'Content-Type': 'application/json' });

    const bundle = {
      authData: { apiKey, websiteId, baseUrl },
      inputData: { checkpointId: invalidCheckpointId }
    };

    try {
      await appTester(App.creates.getCheckpointDetails.operation.perform, bundle);
    } catch (error) {
      const parsedError = JSON.parse(error.message);
      expect(parsedError.status).toBe(404);
      const body = JSON.parse(parsedError.content);
      expect(body).toMatchObject(apiErrorBody);
    }
  });
});