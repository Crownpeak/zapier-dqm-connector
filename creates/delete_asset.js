const perform = async (z, bundle) => {
  const { apiKey, baseUrl, websiteId } = bundle.authData;
  const assetId = bundle.inputData.assetId;

  if (!assetId) {
    throw new z.errors.Error('Asset ID is required', 'MissingField');
  }

  const params = new URLSearchParams({ apiKey, websiteId });
  const url = `${baseUrl}/assets/${assetId}?${params.toString()}`;

  const response = await z.request({
    method: 'DELETE',
    url,
  });

  return response.json || {};
};

module.exports = {
  key: 'deleteAsset',
  noun: 'Asset',

  display: {
    label: 'Delete an existing asset',
    description: 'Delete an existing asset from the system.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'assetId',
        label: 'Asset ID',
        type: 'string',
        required: true,
        helpText: 'ID of the asset to query',
      },
    ],
  },
};
