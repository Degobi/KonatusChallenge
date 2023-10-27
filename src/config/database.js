const Sequelize = require('sequelize');

const database = {
  dev: {
    connection: new Sequelize({
      database: 'konatus',
      username: 'sa',
      password: 'ads@2020',
      host: 'COMPUTER-PC',
      port: 1433,
      dialect: 'mssql',
      logging: false,
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      dialectOptions: {
        options: {
          encrypt: false,
        },
      },
    }),
  },
};

module.exports = {
  connection: database.dev.connection,
  Sequelize,
};
