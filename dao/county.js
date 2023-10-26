const { Sequelize, connection } = require('../src/config/database');
const { Model, DataTypes } = Sequelize;

class County extends Model {}

County.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  uf: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: 'uf'
  },
  code_county: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'code_county'
  },
  name: {
    type: DataTypes.STRING,
    field: 'name'
  },
  population: {
    type: DataTypes.INTEGER,
    field: 'population'
  },
}, {
  sequelize: connection,
  tableName: 'County',
  freezeTableName: true,
  timestamps: false,
  underscored: false,
});

module.exports = County;
