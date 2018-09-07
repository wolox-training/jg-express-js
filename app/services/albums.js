const rp = require('request-promise'),
  config = require('./../../config'),
  errors = require('../errors'),
  options = {
    uri: `${config.common.url}/albums`,
    json: true
  };

exports.getListAlbums = () => {
  return rp(options)
    .then(res => {
      return res;
    })
    .catch(err => {
      throw errors.notFound(err.message);
    });
};

exports.getOneAlbum = id => {
  return rp(options)
    .then(res => res)
    .catch(err => {
      throw errors.defaultError(err.message);
    });
};
