const perform = async (z, bundle) => {
  const {apiKey, baseUrl} = bundle.authData;

  const params = new URLSearchParams({apiKey});
  const url = `${baseUrl}/websites?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: {'Accept': 'application/json; charset=UTF-8'},
  });

  if (response.status !== 200) {
    throw new z.errors.Error(
        `Unexpected status code ${response.status}`,
        'RequestError',
        response.status
    );
  }

  return response.json;
}

module.exports = {
  key: 'listWebsites',
  noun: 'Website',

  display: {
    label: 'List all available websites',
    description: 'Retrieve all available websites you have access to.',
  },

  operation: {
    perform,

    // This is a Zapier restriction. Searches need at least one `inputField`.
    inputFields: [
      {
        key: 'dummy',
        required: false,
        computed: true,
        helpText: 'Dummy field to satisfy Zapier requirement for at least one input field.',
      }
    ],
  }
};
