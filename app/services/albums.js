const rp = require('request-promise'),
  config = require('./../../config'),
  errors = require('../errors');

exports.getAlbums = id => {
  const options = { json: true };
  if (id) {
    options.uri = `${config.common.url}/albums/${id}`;
  } else {
    options.uri = `${config.common.url}/albums`;
  }
  return rp(options).catch(err => {
    throw errors.fetchError(err.message);
  });
};
