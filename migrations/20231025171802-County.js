'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('County', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uf: {
        type: Sequelize.STRING(2),
        allowNull: false
      },
      codeCounty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'code_county'
      },
      name: {
        type: Sequelize.STRING,
      },
      population: {
        type: Sequelize.INTEGER,
      },
      
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('County');
  }
};
