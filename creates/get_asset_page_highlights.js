const perform = async (z, bundle) => {
  const { apiKey, baseUrl, websiteId } = bundle.authData;
  const assetId = bundle.inputData.assetId;

  if (!assetId) {
    throw new z.errors.Error('Asset ID is required', 'MissingField');
  }

  const params = new URLSearchParams({ apiKey, websiteId });
  const url = `${baseUrl}/assets/${assetId}/pagehighlight/all?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { 'Accept': 'text/html; charset=UTF-8' },
  });

  // Raw HTML needs to be returned inside an object
  return { content: response.content };
};

module.exports = {
  key: 'getAssetPageHighlights',
  noun: 'Asset',
  display: {
    label: 'Get asset content with page highlights',
    description: 'Get asset content with all page highlightable issues.',
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