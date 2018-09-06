const fetch = require('node-fetch'),
  userAlbum = require('../models').useralbum,
  config = require('./../../config'),
  errors = require('../errors');

exports.getListAlbums = () => {
  return fetch(`${config.common.url}`)
    .then(res => {
      return res.json();
    })

    .catch(err => {
      throw errors.defaultError(err.message);
    });
};

exports.getOneAlbum = id => {
  return fetch(`${config.common.url}${id}`)
    .then(res => {
      return res.json();
    })

    .catch(err => {
      throw errors.defaultError(err.message);
    });
};

exports.getUserAlbums = id =>
  userAlbum.getAllUserAlbums(id).then(albums => {
    const albumArray = [];
    albums.forEach(element => albumArray.push(exports.getOneAlbum(`/${element.albumId}`)));
    return Promise.all(albumArray);
  });
