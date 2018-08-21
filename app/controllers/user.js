const User = require('../models').user,
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

exports.createUser = (req, res, next) =>
  newUser(req.body)
    .then(user =>
      User.create(user).then(createUser => {
        logger.info(`User correctly created. Welcome, ${createUser.firstName} ${createUser.lastName}`);
        res.status(201).end();
      })
    )
    .catch(next);
