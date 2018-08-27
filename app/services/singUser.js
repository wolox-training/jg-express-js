const User = require('../models').user,
  validations = require('../controllers/validations'),
  bcrypt = require('bcryptjs'),
  logger = require('../logger'),
  tokens = require('../services/tokenGenerator'),
  errors = require('../errors');

exports.signIn = (req, res, next) => {
  const singInUser = req.body
    ? {
        password: req.body.password,
        email: req.body.email
      }
    : {};

  const errMsg = validations.validateUser(singInUser);
  if (errMsg.length > 0) {
    next(errors.invalidUser(errMsg));
  } else {
    User.findOne({
      attributes: ['email', 'password'],
      where: {
        email: singInUser.email
      }
    })
      .catch(err => {
        throw errors.databaseError(err.message);
      })
      .then(userFound => {
        if (userFound) {
          return bcrypt.compare(singInUser.password, userFound.password).then(passwordValid => {
            if (passwordValid) {
              logger.info(`User ${userFound.email} singed in`);
              const authentication = tokens.encode({ email: userFound.email });
              res.set(tokens.header, authentication);
              res.status(201).end();
            } else {
              next(errors.invalidUser(`Email ${singInUser.email} or password are incorrect.`));
            }
          });
        } else {
          next(errors.invalidUser(`Cannot find user ${singInUser.email} or is invalid.`));
        }
      })
      .catch(next);
  }
};
