const albumService = require('../services/albums');

exports.albumList = (req, res, next) =>
  albumService
    .getListAlbums()
    .then(data => res.send(data))
    .catch(next);
