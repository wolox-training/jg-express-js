const rp = require('request-promise'),
  config = require('./../../config'),
  errors = require('../errors');

exports.getAlbums = id => {
  let options = {};
  if (id) {
    options = {
      uri: `${config.common.url}/albums/${id}`,
      json: true
    };
  } else {
    options = {
      uri: `${config.common.url}/albums`,
      json: true
    };
  }
  return rp(options).catch(err => {
    throw errors.fetchError(err.message);
  });
};
