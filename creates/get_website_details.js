const perform = async (z, bundle) => {
  const { apiKey, baseUrl } = bundle.authData;
  const websiteId = bundle.inputData.websiteId;

  if (!websiteId) {
    throw new z.errors.Error('Website ID is required', 'MissingField');
  }

  const params = new URLSearchParams({ apiKey });
  const url = `${baseUrl}/websites/${websiteId}?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { 'Accept': 'application/json; charset=UTF-8' },
  });

  return response.json;
};

module.exports = {
  key: 'getWebsiteDetails',
  noun: 'Website',

  display: {
    label: 'Get details for a specific website',
    description: 'Get detailed information for a specific website.',
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
  },
};