'use strict';

const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
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

  user.createNewModel = User =>
    user.create(User).catch(err => {
      throw errors.databaseError(err.message);
    });

  return user;
};
