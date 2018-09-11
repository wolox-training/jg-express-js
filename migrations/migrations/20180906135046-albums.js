'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('user_albums', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        albumId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() =>
        queryInterface.addIndex('user_albums', ['userId', 'albumId'], {
          indicesType: 'UNIQUE'
        })
      ),

  down: (queryInterface, Sequelize) =>
    queryInterface
      .removeIndex('user_albums', ['userId', 'albumId'])
      .then(() => queryInterface.dropTable('user_albums'))
};
