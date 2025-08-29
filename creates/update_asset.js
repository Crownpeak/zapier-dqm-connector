const perform = async (z, bundle) => {
  const { apiKey, baseUrl, websiteId } = bundle.authData;
  const { assetId, content } = bundle.inputData;

  if (!assetId) {
    throw new z.errors.Error('Asset ID is required', 'MissingField');
  }
  if (!content) {
    throw new z.errors.Error('Content is required', 'MissingField');
  }

  const params = new URLSearchParams({ apiKey });
  const url = `${baseUrl}/assets/${assetId}?${params.toString()}`;

  const body = new URLSearchParams({ websiteId, content }).toString();

  const response = await z.request({
    method: 'PUT',
    url,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  return response.json;
};

module.exports = {
  key: 'update_asset',
  noun: 'Asset',
  display: {
    label: 'Update an existing content asset',
    description: 'Update an existing content asset for processing.',
  },
  operation: {
    perform,

    inputFields: [
      { key: 'assetId',
        label: 'Asset ID',
        type: 'string',
        required: true,
        helpText: 'ID of the asset to query',
      },
      { key: 'content',
        label: 'Page Content',
        type: 'text',
        required: true,
        helpText: 'HTML or plain text content to check',
      },
    ],
  },
};