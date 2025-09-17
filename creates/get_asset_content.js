const perform = async (z, bundle) => {
  const { apiKey, baseUrl, websiteId } = bundle.authData;
  const assetId = bundle.inputData.assetId;

  if (!assetId) {
    throw new z.errors.Error('Asset ID is required', 'MissingField');
  }

  const params = new URLSearchParams({ apiKey, websiteId });
  const url = `${baseUrl}/assets/${assetId}/content?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { 'Accept': 'text/html; charset=UTF-8' },
  });

  // Raw HTML needs to be returned inside an object
  return { content: response.content };
};

module.exports = {
  key: 'getAssetContent',
  noun: 'Asset',

  display: {
    label: 'Get content for a specific asset',
    description: 'Get the actual content (HTML/text) for a specific asset.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'assetId',
        label: 'Asset ID',
        type: 'string',
        required: true,
        helpText: 'ID of the asset to query' },
    ],
  },
};