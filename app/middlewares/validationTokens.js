const tokens = require('../services/tokenGenerator'),
  logger = require('../logger'),
  User = require('../models').user,
  errors = require('../errors');

exports.validateToken = (req, res, next) => {
  const token = req.headers[tokens.header];
  if (token) {
    try {
      const payload = tokens.decode(token);
      User.findOne({ where: { email: payload.email } })
        .then(Userdb => {
          if (Userdb) {
            logger.info(`User: ${payload.email} success token`);
            req = Userdb;
            next();
          } else {
            next(errors.invalidToken('Invalid token.'));
          }
        })
        .catch(next);
    } catch (err) {
      next(errors.invalidToken(err.message));
    }
  } else {
    next(errors.invalidToken('Token not found'));
  }
};

exports.validateAdmin = (req, res, next) => {
  if (!req.body.isAdmin) {
    next(errors.invalidUser(`User ${req.body.email} do not have the required privileges`));
  } else {
    next();
  }
};