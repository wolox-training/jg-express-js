const User = require('../models').user,
  saltRounds = 10,
  validations = require('./validations'),
  tokens = require('../services/tokenGenerator'),
  bcrypt = require('bcryptjs'),
  logger = require('../logger'),
  errors = require('../errors');

const newUser = body => {
  const createUser = body
    ? {
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password,
        email: body.email
      }
    : {};

  const errorMsg = validations.validateUser(createUser);
  if (errorMsg.length > 0) {
    throw errors.invalidUser(errorMsg);
  } else {
    return bcrypt.hash(createUser.password, saltRounds).then(hash => {
      createUser.password = hash;
      return createUser;
    });
  }
};

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
    return User.searchUserWhere(['email', 'password'], { email: singInUser.email })
      .then(userFound => {
        if (userFound) {
          return bcrypt.compare(singInUser.password, userFound.password).then(passwordValid => {
            if (passwordValid) {
              logger.info(`User ${userFound.email} singed in`);
              const authentication = tokens.encode({ email: userFound.email });
              res.set(tokens.header, authentication);
              res.status(200).end();
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

exports.createUser = (req, res, next) =>
  newUser(req.body)
    .then(user =>
      User.createNewModel(user).then(createUser => {
        logger.info(`User correctly created. Welcome, ${createUser.firstName} ${createUser.lastName}`);
        res.status(201).end();
      })
    )
    .catch(next);

exports.getListUsers = (req, res, next) => {
  const limit = req.query.limit || 5;
  const offset = (req.query.page - 1 || 0) * limit || 0;
  return User.paginationUsers(limit, offset)
    .then(data => res.send(data))
    .catch(next);
};
