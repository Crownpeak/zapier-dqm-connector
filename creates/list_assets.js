const perform = async (z, bundle) => {
  const { apiKey, websiteId, baseUrl } = bundle.authData;
  const limit = bundle.inputData.limit?.toString() || '50';

  const params = new URLSearchParams({ apiKey, websiteId, limit });
  const url = `${baseUrl}/assets?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { Accept: 'application/json; charset=UTF-8' },
  });

  return response.json;
};

module.exports = {
  key: 'listAssets',
  noun: 'Asset',

  display: {
    label: 'List assets',
    description: 'Retrieve all available assets for this website.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'limit',
        label: 'Limit',
        type: 'integer',
        required: false,
        default: '50',
        helpText: 'Max number of results to return',
      },
    ],
  },
};


