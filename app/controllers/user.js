const User = require('../models').user,
  saltRounds = 10,
  validations = require('./validations'),
  bcrypt = require('bcryptjs'),
  logger = require('../logger'),
  tokens = require('../services/tokenGenerator'),
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
      User.createNewModel(user).then(createUser => {
        logger.info(`User correctly created. Welcome, ${createUser.firstName} ${createUser.lastName}`);
        res.status(201).end();
      })
    )
    .catch(next);

exports.signIn = (req, res, next) => {
  const singInUser = req.body
    ? {
        password: req.body.password,
        email: req.body.email
      }
    : {};

  const errMsg = validations.validateSignIn(singInUser);
  if (errMsg.length > 0) {
    next(errors.invalidUser(errMsg));
  } else {
    User.findOne({
      attributes: ['email', 'password'],
      where: {
        email: singInUser.email
      }
    })
      .then(db => {
        if (db) {
          return bcrypt.compare(singInUser.password, db.password).then(pass => {
            if (pass) {
              logger.info('User singed in');
              const authentication = tokens.encode({ email: db.email });
              res.set(tokens.header, authentication);
              res.status(201).end();
            } else {
              next(errors.invalidUser('Email or password are incorrect.'));
            }
          });
        } else {
          next(errors.invalidUser('Cannot find that user or is invalid.'));
        }
      })
      .catch(next);
  }
};
