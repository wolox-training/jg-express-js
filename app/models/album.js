'use strict';

const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const userAlbum = sequelize.define('user_album', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    underscored: true,
    freezeTableName: true
  });

  userAlbum.createPurchase = (userId, albumId) =>
    userAlbum.create({ userId, albumId }).catch(err => {
      if (err instanceof sequelize.UniqueConstraintError) {
        throw errors.dataConflict('User cannot purchase the same album twice');
      } else {
        throw errors.defaultError(err.message);
      }
    });

  userAlbum.getAllUserAlbums = userId =>
    userAlbum.findAll({ attributes: ['albumId'], where: { userId } }).catch(err => {
      throw errors.databaseError(err.message);
    });
  return userAlbum;
};
