'use strict';

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.addColumn('users', 'isAdmin', DataTypes.BOOLEAN, {
      allowNull: false,
      after: 'password',
      defaultValue: false
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'isAdmin')
};
