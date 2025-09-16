const perform = async (z, bundle) => {
  const { apiKey, baseUrl, websiteId } = bundle.authData;
  const assetId = bundle.inputData.assetId;

  if (!assetId) {
    throw new z.errors.Error('Asset ID is required', 'MissingField');
  }

  const params = new URLSearchParams({ apiKey, websiteId });
  const url = `${baseUrl}/assets/${assetId}/status?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { 'Accept': 'application/json; charset=UTF-8' },
  });

  return response.json;
};

module.exports = {
  key: 'getAssetStatus',
  noun: 'Asset',

  display: {
    label: 'Check quality status for asset',
    description: 'Check the current status of an asset.',
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