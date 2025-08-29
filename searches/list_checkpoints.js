const perform = async (z, bundle) => {
  const { apiKey, baseUrl } = bundle.authData;

  const params = new URLSearchParams({ apiKey });
  const url = `${baseUrl}/checkpoints?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { 'Accept': 'application/json; charset=UTF-8' },
  });

  return response.json || [];
};

module.exports = {
  key: 'listCheckpoints',
  noun: 'Checkpoint',

  display: {
    label: 'List all available checkpoints',
    description: 'Retrieve all available quality check checkpoints.',
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
  },
};