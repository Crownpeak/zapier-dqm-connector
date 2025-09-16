const perform = async (z, bundle) => {
  const { apiKey, baseUrl, websiteId } = bundle.authData;
  const { assetId, checkpointId } = bundle.inputData;

  if (!assetId) {
    throw new z.errors.Error('Asset ID is required', 'MissingField');
  }
  if (!checkpointId) {
    throw new z.errors.Error('Checkpoint ID is required', 'MissingField');
  }

  const params = new URLSearchParams({ apiKey, websiteId });
  const url = `${baseUrl}/assets/${assetId}/errors/${checkpointId}?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { 'Accept': 'text/html; charset=UTF-8' },
  });

  // Raw HTML needs to be returned inside an object
  return { content: response.content };
};

module.exports = {
  key: 'getAssetErrorsByCheckpoint',
  noun: 'Asset',

  display: {
    label: 'Get asset errors for a specific checkpoint',
    description: 'Get asset content highlighting issues for a specific checkpoint.',
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
      {
        key: 'checkpointId',
        label: 'Checkpoint ID',
        type: 'string',
        required: true,
        helpText: 'ID of the checkpoint to get errors for'
      },
    ],
  },
};