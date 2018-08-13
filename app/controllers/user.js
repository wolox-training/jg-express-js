const User = require('../models/user').user,
  saltRounds = 10,
  validations = require('./validations'),
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

  const errMsg = validations.validateUser(createUser);
  if (errMsg.length > 0) {
    throw errors.invalidUser(errMsg);
  } else {
    return bcrypt.hash(createUser.password, saltRounds).then(hash => {
      createUser.password = hash;
      return createUser;
    });
  }
};

exports.createUser = (req, res, next) =>
  newUser(req.body)
    .then(user =>
      User.createUser(user).then(createUser => {
        logger.info(`User correctly created. Welcome, ${createUser.firstName} ${createUser.lastName}`);
        res.status(201);
      })
    )
    .catch(next);
