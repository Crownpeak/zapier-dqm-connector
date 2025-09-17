'use strict';

// This function runs after every outbound request. You can use it to check for
// errors or modify the response. You can have as many as you need. They'll need
// to each be registered in your index.js file.
const handleBadResponses = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      'The API Key you supplied is incorrect',
      'AuthenticationError',
      response.status,
    );
  }

  return response;
};

// This function runs before every outbound request. You can have as many as you
// need. They'll need to each be registered in your index.js file.
const includeApiKey = (request, z, bundle) => {
  request.params = request.params || {};
  request.params.apiKey = bundle.authData.apiKey; // query param

  request.headers = request.headers || {};
  request.headers['x-api-key'] = bundle.authData.apiKey; // header

  return request;
};

module.exports = { befores: [includeApiKey], afters: [handleBadResponses] };
