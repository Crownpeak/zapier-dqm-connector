const perform = async (z, bundle) => {
  const { apiKey, baseUrl } = bundle.authData;
  const websiteId = bundle.inputData.websiteId;

  if (!websiteId) {
    throw new z.errors.Error('Website ID is required', 'MissingField');
  }

  const params = new URLSearchParams({ apiKey });
  const url = `${baseUrl}/websites/${websiteId}/checkpoints?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { 'Accept': 'application/json; charset=UTF-8' },
  });

  return response.json;
};

module.exports = {
  key: 'getWebsiteCheckpoints',
  noun: 'Website Checkpoints',

  display: {
    label: 'Get checkpoints for a specific website',
    description: 'Get all checkpoints available for a specific website.'
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'websiteId',
        label: 'Website ID',
        type: 'string',
        required: true,
        helpText: 'The ID of the website to get details or checkpoints for',
      },
    ],
  }
};
