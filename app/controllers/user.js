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
      User.createNewModel(user).then(createUser => {
        logger.info(`User correctly created. Welcome, ${createUser.firstName} ${createUser.lastName}`);
        res.status(201).end();
      })
    )
    .catch(next);

exports.getListUsers = (req, res, next) => {
  const limit = req.query.limit || 10;
  const offset = req.query.page || 0;
  return User.findAndCountAll({
    attributes: ['firstName', 'lastName', 'email'],
    limit,
    offset,
    order: [['email', 'ASC']]
  })
    .catch(err => {
      throw errors.databaseError(err.message);
    })
    .then(getUsers => {
      res.send(getUsers);
    })
    .catch(next);
};

exports.newAdmin = (req, res, next) =>
  newUser(req.body)
    .then(createAdmin => {
      createAdmin.isAdmin = true;
      return User.doUpsert(createAdmin).then(isCreated => {
        isCreated
          ? logger.info(`New admin created: ${User.email}`)
          : logger.info(`User: ${User.email} its now an admin`);
        res.status(201).end();
      });
    })
    .catch(err => {
      throw errors.databaseError(err.message);
    })
    .catch(next);
