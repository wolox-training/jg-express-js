'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: 'compositeIndex' },
      password: { type: DataTypes.STRING, unique: 'compositeIndex' }
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
