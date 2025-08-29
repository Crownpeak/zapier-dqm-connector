const perform = async (z, bundle) => {
  const { apiKey, baseUrl } = bundle.authData;
  const checkpointId = bundle.inputData.checkpointId;

  if (!checkpointId) {
    throw new z.errors.Error(
        'Checkpoint ID is required',
        'MissingCheckpointId',
        400
    );
  }

  const params = new URLSearchParams({ apiKey });
  const url = `${baseUrl}/checkpoints/${checkpointId}?${params.toString()}`;

  const response = await z.request({
    method: 'GET',
    url,
    headers: { 'Accept': 'application/json; charset=UTF-8' },
  });

  return response.json;
};

module.exports = {
  key: 'getCheckpointDetails',
  noun: 'Checkpoint',

  display: {
    label: 'Get details for a specific checkpoint',
    description: 'Get detailed information for a specific checkpoint.',
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'checkpointId',
        required: true,
        type: 'string',
        label: 'Checkpoint ID',
        helpText: 'ID of the checkpoint to get errors for',
      },
    ],
  },
};

