'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('useralbums', {
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
        queryInterface.addIndex('useralbums', ['userId', 'albumId'], {
          indicesType: 'UNIQUE'
        })
      ),

  down: (queryInterface, Sequelize) =>
    queryInterface
      .removeIndex('useralbums', ['userId', 'albumId'])
      .then(() => queryInterface.dropTable('userAlbum'))
};
