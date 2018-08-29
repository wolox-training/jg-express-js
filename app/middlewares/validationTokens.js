const tokens = require('../services/tokenGenerator'),
  logger = require('../logger'),
  User = require('../models').user,
  errors = require('../errors');

exports.validateToken = (req, res, next) => {
  const token = req.headers[tokens.header];
  if (token) {
    try {
      const payload = tokens.decode(token);
      return User.findOne({ where: { email: payload.email } })
        .catch(err => {
          throw errors.databaseError(err.message);
        })
        .then(userDb => {
          if (userDb) {
            logger.info(`User: ${payload.email} success token`);
            req = userDb.user;
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
