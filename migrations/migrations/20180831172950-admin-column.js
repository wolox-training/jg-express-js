'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'isAdmin', Sequelize.BOOLEAN, {
      allowNull: false,
      after: 'password',
      defaultValue: false
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'isAdmin')
};
