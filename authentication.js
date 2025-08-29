'use strict';

const test = (z, bundle) =>
    z.request({
      url: `${bundle.authData.baseUrl}/assets`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bundle.authData.apiKey}`,
      },
    });

module.exports = {
  type: 'custom',

  fields: [
    {
      key: 'apiKey',
      label: 'API Key (Required)',
      required: true,
      type: 'string',
      helpText: 'Your DQM API Key (required)',
    },
    {
      key: 'websiteId',
      label: 'Website Identifier',
      required: true,
      type: 'string',
      helpText: 'Your DQM Website ID (required)',
    },
    {
      key: 'baseUrl',
      label: 'Base URL',
      required: true,
      type: 'string',
      default: 'https://api.crownpeak.net/dqm-cms/v1',
      helpText: 'The DQM API URL (required)',
    },
  ],

  test,

  connectionLabel: '{{bundle.authData.websiteId}}',
};
