const xlsx                      = require('xlsx');
const County                    = require('../../dao/county');
const path                      = require('path')
const { connection, Sequelize } = require('../config/database')

class GraphicModel {
    constructor() {
        this.data = [65, 59, 80, 81, 56];
    }

    getData() {
        return this.data;
    }

    async updateBaseCounty(req, res) {
        const existingData = await County.findOne();

        if (existingData?.dataValues)
            return 'Base de dados está atualizada.';

        try {
            const nomeDoArquivo = 'estimativa_dou_2021.xls';
            const caminhoDoArquivo = path.join(__dirname, '..', 'files', nomeDoArquivo);

            const workbook = xlsx.readFile(caminhoDoArquivo);
            console.log(workbook)
            const worksheet = workbook.Sheets[workbook.SheetNames[1]];
        
            const data = []
            this.dataFromWorkSheet(data, worksheet)
        
            let transaction = await connection.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED }) 

            let container     = [];   
            let blockRecords  = [];
            let countRecords  = 0;
            let count         = 0;

            for (const row of data) {
                Object.keys(County.fieldAttributeMap).forEach(propName => {
                    if (row[propName] || row[propName] === 0) {
                        let value = row[propName];
                        row[County.fieldAttributeMap[propName]] = value;
                    }
                })            
        
                blockRecords.push(row);
                countRecords++;
                count++;
        
                if (countRecords === 1000 || count === data.length) {
                    container.push([ ...blockRecords ]);
                    blockRecords = [];
                    countRecords = 0;
                }
            }

            let idx = 1;
            let promisses = [];

            for (let county of data) {
                promisses.push(County.create(county, {
                    transaction 
                }))

                console.log(`Municípios ${idx} de ${data.length} incluído...`);
                idx++;
            }

            await Promise.all(promisses);
            transaction.commit();

            return 'Atualização concluída com sucesso!';
        } catch (error) {
            transaction.rollback();
            throw error;
        }
    }

    dataFromWorkSheet(dataSet, worksheet) {
        let ref      = worksheet['!ref'].split(':');
        let rowCount = Number(ref[1].replace(/\D+/g,''));

        const schema = {
            uf          : 'A',
            code_county : 'C',
            name        : 'D',
            population  : 'E' 
        }

        for (let i = 2; i <= rowCount; i++) {
            let record = {};
            
            Object.keys(schema).forEach(propName => {
                if (worksheet[schema[propName] + i]) {
                    record[propName] = typeof worksheet[schema[propName] + i].v === "string" ? String(worksheet[schema[propName] + i].v).trim() : worksheet[schema[propName] + i].v;
                }            
            })

            dataSet.push(record);
    
            if (i == rowCount) console.log(`*** Leitura do registro ${i - 1}/${rowCount - 1} concluída...`)
        }
    }
}

module.exports = GraphicModel;
