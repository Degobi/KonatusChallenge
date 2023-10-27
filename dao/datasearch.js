const { Sequelize, connection } = require('../src/config/database');
const { Model, DataTypes } = Sequelize;

class Datasearch extends Model {}

Datasearch.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  id_pesquisa: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: 'id_pesquisa'
  },
  data_pesquisa: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_pesquisa'
  },
  municipio: {
    type: DataTypes.STRING,
    field: 'municipio'
  },
  estado: {
    type: DataTypes.STRING(2),
    field: 'estado'
  },
   intencao_voto: {
    type: DataTypes.STRING(1)
  },
}, {
  sequelize: connection,
  tableName: 'Datasearch',
  freezeTableName: true,
  timestamps: false,
  underscored: false,
});

module.exports = Datasearch;
