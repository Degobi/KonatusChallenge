const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'ads@2020',
    server: 'COMPUTER-PC',
    port: 54416,
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
