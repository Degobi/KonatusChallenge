'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Datasearch', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idPesquisa: {
        type: Sequelize.STRING(2),
        allowNull: false,
        field: 'id_pesquisa'
      },
      dataPesquisa: {
        type: Sequelize.DATEONLY,
        field: 'data_pesquisa'
      },
      municipio: {
        type: Sequelize.STRING,
      },
      estado: {
        type: Sequelize.STRING(2),
      }, 
      intencaoVoto: {
        type: Sequelize.STRING(1),
        field: 'intencao_voto'
      },
      
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Datasearch');
  }
};
