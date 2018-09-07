const albumService = require('../services/albums'),
  userAlbum = require('../models').useralbum,
  logger = require('../logger'),
  errors = require('../errors');

exports.albumList = (req, res, next) =>
  albumService
    .getListAlbums()
    .then(data => res.send(data))
    .catch(next);

exports.purchaseAlbum = (req, res, next) => {
  const albumId = parseInt(req.params.id);
  if (!albumId) next(errors.notFound('Album not Found'));
  albumService
    .getOneAlbum(albumId)
    .then(album => {
      if (album) {
        userAlbum
          .createPurchase(req.user.id, albumId)
          .then(() => {
            logger.info(`User -> ${req.user.email}, ID: ${req.user.id} bought album #${albumId}`);
            res.status(201).end();
          })
          .catch(next);
      } else {
        next(errors.notFound('Album does not exist or cannot found'));
      }
    })
    .catch(next);
};
