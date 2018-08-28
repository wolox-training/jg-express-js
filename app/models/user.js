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

  User.searchUserWhere = (userInfo, where) =>
    User.findOne({
      userInfo,
      where
    }).catch(err => {
      throw errors.databaseError(err.message);
    });

  User.paginationUsers = (limit, offset) =>
    User.findAndCountAll({
      attributes: ['firstName', 'lastName', 'email'],
      limit,
      offset,
      order: [['email', 'ASC']]
    }).catch(err => {
      throw errors.databaseError(err.message);
    });

  return User;
};
