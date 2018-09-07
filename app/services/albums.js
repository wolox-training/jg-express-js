const rp = require('request-promise'),
  config = require('./../../config'),
  errors = require('../errors');

exports.getListAlbums = () => {
  const options = {
    uri: `${config.common.url}/albums`,
    json: true
  };
  return rp(options)
    .then(res => {
      return res;
    })
    .catch(err => {
      throw errors.notFound(err.message);
    });
};
