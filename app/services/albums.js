const fetch = require('node-fetch'),
  config = require('./../../config'),
  errors = require('../errors');

exports.getListAlbums = () => {
  return fetch(config.common.url)
    .then(res => {
      return res.json();
    })

    .catch(err => {
      throw errors.defaultError(err.message);
    });
};
