const dictum = require('dictum.js');

dictum.document({
  description: 'Some description for the given endpoint',
  endpoint: '/some/endpoint',
  method: 'GET',
  requestHeaders: {},
  requestPathParams: {},
  requestBodyParams: {},
  responseStatus: 200,
  responseHeaders: {},
  responseBody: {},
  resource: 'My Resource'
});
