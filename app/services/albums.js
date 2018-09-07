const rp = require('request-promise'),
  config = require('./../../config'),
  errors = require('../errors');

exports.getListAlbums = () => {
  const options = {
    uri: `${config.common.url}/albums`,
    json: true
  };
  return rp(options).catch(err => {
    throw errors.fetchError(err.message);
  });
};

exports.getOneAlbum = id => {
  const options = {
    uri: `${config.common.url}/albums/${id}`,
    json: true
  };
  return rp(options).catch(err => {
    throw errors.fetchError(err.message);
  });
};
