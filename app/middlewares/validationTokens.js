const tokens = require('../services/tokenGenerator'),
  logger = require('../logger'),
  User = require('../models').user,
  errors = require('../errors');

exports.validateToken = (req, res, next) => {
  const token = req.headers[tokens.header];
  if (token) {
    try {
      const payload = tokens.decode(token);
      return User.findOneUserWhere({ email: payload.email })
        .then(userDb => {
          if (userDb) {
            logger.info(`User: ${payload.email} success token`);
            req.user = userDb;
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
  if (!req.user.isAdmin) {
    next(errors.invalidUser(`User ${req.user.email} do not have the required privileges`));
  } else {
    next();
  }
};
