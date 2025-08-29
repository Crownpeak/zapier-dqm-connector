const perform = async (z, bundle) => {
  const { apiKey, baseUrl, websiteId } = bundle.authData; // websiteId if needed
  const assetId = bundle.inputData.assetId;

  if (!assetId) {
    throw new z.errors.Error('Asset ID is required', 'MissingField');
  }

  const params = new URLSearchParams({ apiKey, websiteId });

  const url = `${baseUrl}/assets/${assetId}?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { 'Accept': 'application/json; charset=UTF-8' },
  });

  return response.json;
};

module.exports = {
  key: 'get_asset_details',
  noun: 'Asset',

  display: {
    label: 'Get details for a specific asset',
    description: 'Get detailed information for a specific asset.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'assetId',
        label: 'Asset ID',
        type: 'string',
        required: true,
        helpText: 'ID of the asset to query'
      },
    ],
  },
};