const sql       = require('mssql');
const Sequelize = require('sequelize')

const config = {
    user: 'sa',
    password: 'ads@2020',
    server: 'COMPUTER-PC',
    port: 1433,
    database: 'konatus',
    dialect: 'mssql',
    options: {
        encrypt: false,
    },
};

sql.connect(config, (err) => {
    if (err) {
        console.error('Error connecting to SQL Server:', err);
        return;
    }
    console.log('Connection to SQL Server successful');
});


const database = {
    dev: {
      connection: new Sequelize('konatus', 'sa', 'ads@2020', {
        host: 'COMPUTER-PC',
        dialect: 'mssql',
        logging: false,
        port: 1433,
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        dialectOptions: {
          options: {
            encrypt: false
          },
        },
      }),
    } 
}

module.exports = {
    connection : database.dev.connection,
    Sequelize
}