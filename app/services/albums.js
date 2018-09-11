const userAlbum = require('../models').user_album,
  rp = require('request-promise'),
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

exports.getUserAlbums = id =>
  userAlbum.getAllUserAlbums(id).then(albums => {
    const albumArray = [];
    albums.forEach(element => albumArray.push(exports.getAlbums(`/${element.albumId}`)));
    return Promise.all(albumArray);
  });
