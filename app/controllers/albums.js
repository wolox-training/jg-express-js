const albumService = require('../services/albums'),
  User = require('../models').user,
  userAlbum = require('../models').useralbum,
  logger = require('../logger'),
  errors = require('../errors');

exports.albumList = (req, res, next) => {
  albumService
    .getListAlbums()
    .then(data => res.send(data))
    .catch(next);
};

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

exports.userAlbums = (req, res, next) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.isAdmin || req.user.id === userId) {
    return User.findOneUserWhere({ id: userId })
      .then(user => {
        if (user) {
          return albumService
            .getUserAlbums(user.id)
            .then(albums => {
              res.send(albums);
            })
            .catch(next);
        } else {
          next(errors.invalidUser(`User -> ${req.user.email}, ID: ${userId} does not exist`));
        }
      })
      .catch(next);
  } else {
    next(errors.invalidUser('User cannot see others users albums.'));
  }
};
