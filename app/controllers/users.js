const users = require('../models/user').users;
const validations = require('./validations');
const bcrypt = require('bcryptjs');

module.exports = {
  create(req, res) {
    return users
      .create({
        firstName: req.users.firstName,
        lastName: req.lastName.lastName,
        email: req.users.email,
        passowrd: bcrypt.hashSync(req.users.passowrd, 10)
      })
      .then(User => res.status(201).send(users)) // Log donde
      .catch(error => res.status(400).send(error)); // Log wrong (Error)
  }
};
