'use strict';

const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This email already exists'
      }
    },
    password: DataTypes.STRING
  });

  User.createNewModel = user =>
    User.create(user).catch(err => {
      throw errors.requestError(err.message);
    });

  return User;
};
