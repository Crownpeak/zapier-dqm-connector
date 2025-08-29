const perform = async (z, bundle) => {
  const { apiKey, websiteId, baseUrl } = bundle.authData;

  const url = `${baseUrl}/assets?apiKey=${apiKey}`;

  const body = new URLSearchParams({
    websiteId,
    content: bundle.inputData.content,
    contentType: bundle.inputData.contentType || 'text/html; charset=UTF-8',
  }).toString();

  const response = await z.request({
    method: 'POST',
    url,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  return response.json;
};

module.exports = {
  key: 'create_asset',
  noun: 'Asset',

  display: {
    label: 'Create a new asset',
    description: 'Submit new content to be analyzed.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'content',
        label: 'Page Content',
        required: true,
        type: 'text',
        helpText: 'HTML or plain text content to check'
      },
      {
        key: 'contentType',
        label: 'Content Type',
        required: false,
        type: 'string',
        default: 'text/html; charset=UTF-8',
        helpText: 'Type of content (e.g., html, plain)'
      },
    ],
  },
};
