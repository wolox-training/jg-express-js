const mock = require('../services/albums').mock(),
  errors = require('../errors');

exports.list = (req, res, next) =>
  mock
    .getListAlbums()
    .then(data => res.status(201).json(data))
    .catch(err => next(errors.defaultError(`Error - ${err}`)));
