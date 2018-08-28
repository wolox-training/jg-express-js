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
      if (err instanceof sequelize.UniqueConstraintError) {
        throw errors.requestError(err.message);
      }
      throw errors.databaseError(err.message);
    });

  User.getUser = (userInfo, where) =>
    User.findOne({
      userInfo,
      where
    }).catch(err => {
      throw errors.databaseError(err.message);
    });

  return User;
};
