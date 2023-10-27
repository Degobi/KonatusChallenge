const xlsx                      = require('xlsx');
const County                    = require('../../dao/county');
const path                      = require('path');
const { connection, Sequelize } = require('../config/database')
const csv                       = require('csv-parser');
const fs                        = require('fs');
const util                      = require('util');
const readFileAsync             = util.promisify(fs.readFile);
const iconv                     = require('iconv-lite');
const Datasearch                = require('../../dao/datasearch');

class GraphicModel {
    constructor() { }

    async getData() {
        const electoralResearchData = await this.getElectoralResearchData();
        const groupsByState         = {};

        for (const linhaPesquisa of electoralResearchData) {
            const state = linhaPesquisa.estado;
            
            if (!groupsByState[state]) {
                groupsByState[state] = {
                    group1: { maxPopulation: 20000, totalVotosA: 0, totalVotosB: 0 },
                    group2: { maxPopulation: 100000, totalVotosA: 0, totalVotosB: 0 },
                    group3: { maxPopulation: 1000000, totalVotosA: 0, totalVotosB: 0 },
                    group4: { maxPopulation: Infinity, totalVotosA: 0, totalVotosB: 0 },
                };
            }

            const municipality           = linhaPesquisa.municipio;
            const populationMunicipality = await this.getMunicipalityPopulation(municipality, state);

            for (const groupName in groupsByState[state]) {
                if (populationMunicipality <= groupsByState[state][groupName].maxPopulation) {
                    groupsByState[state][groupName].totalVotosA += (linhaPesquisa.intencao_voto === 'A' ? 1 : 0);
                    groupsByState[state][groupName].totalVotosB += (linhaPesquisa.intencao_voto === 'B' ? 1 : 0);
                    break;
                }
            }
        }

        return this.getDataByCandidate(groupsByState);
    }

    async updateBaseCounty(req, res) {
        const existingData = await County.findOne();

        if (existingData?.dataValues)
            return 'Base de dados está atualizada.';

        try {
            const nomeDoArquivo = 'estimativa_dou_2021.xls';
            const caminhoDoArquivo = path.join(__dirname, '..', 'files', nomeDoArquivo);

            const workbook  = xlsx.readFile(caminhoDoArquivo);
            const worksheet = workbook.Sheets[workbook.SheetNames[1]];
            const data      = []

            this.dataFromWorkSheet(data, worksheet)
        
            await connection.authenticate(); 
            await connection.sync();

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

                //console.log(`Municípios ${idx} de ${data.length} incluído...`);
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
    
            //if (i == rowCount) console.log(`*** Leitura do registro ${i - 1}/${rowCount - 1} concluída...`)
        }
    }

    async saveCsv(req, res) {

        if (!req.path)
            return 'Nenhum arquivo foi inserido!'

        try {
          const schema = {
            id_pesquisa     : 'A',
            data_pesquisa   : 'B',
            municipio       : 'C',
            estado          : 'D',
            intencao_voto   : 'E',
          };


          const csvData         = await readFileAsync(req.path);
          const decodedContent  = iconv.decode(csvData, 'ISO-8859-1');
          const lines           = decodedContent.split('\n');
    
          await connection.authenticate(); 
          await connection.sync();
    
          let transaction = await connection.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED });
    
          const bulkCreateData = [];
    
          for (let i = 0; i < lines.length; i++) {
            if (i === 0) {
              continue; // Pula a primeira linha (Geralmente é o cabeçalho do arquivo csv)
            }

            lines[i] = lines[i].replace(/\r/g, '');          
            const lineParts = lines[i].split(';');
          
            if (lineParts.length >= 5) {
              const existingDataDb = await Datasearch.findOne({
                where: {
                    id_pesquisa: lineParts[0],
                },
              });

              if (existingDataDb)
                return 'Pesquisa já foi inserida no banco de dados!'
                
              const dataString      = lineParts[1];
              const [dia, mes, ano] = dataString.split('/');
              const data            = new Date(`${ano}-${mes}-${dia}`);
              lineParts[1]          = data
              const entry           = {};
          
              for (const key of Object.keys(schema)) {
                const columnIndex = schema[key].charCodeAt(0) - 'A'.charCodeAt(0);
                entry[key] = lineParts[columnIndex];
              }
          
              bulkCreateData.push(entry);
            }
          }
          
    
          await Datasearch.bulkCreate(bulkCreateData, {
            transaction,
          });
    
          transaction.commit();
          const data = await this.getData();
          return data;

        } catch (error) {
          transaction.rollback();
          return 'Ocorreu um erro ao salvar os dados no banco de dados.';
        }
    }

    async getElectoralResearchData() {
        try {
            const researchData = await Datasearch.findAll();
            return researchData;
        } catch (error) {
            throw error
        }
    }

    async getMunicipalityPopulation(municipality, state) {
        const municipalityInfo = await County.findOne({
          where: {
            uf: state,
            name: municipality,
          },
        });
      
        return municipalityInfo ? municipalityInfo.population : null;
    }

    async getDataByCandidate(groupsByState) {
        const states = Object.keys(groupsByState).sort();
        const data   = { CandidatoA: [], CandidatoB: [] };
        
        for (const state of states) {
          const stateData = groupsByState[state];
          const totalVotosA = Object.values(stateData).reduce((acc, group) => acc + group.totalVotosA, 0);
          const totalVotosB = Object.values(stateData).reduce((acc, group) => acc + group.totalVotosB, 0);
        
          data.CandidatoA.push(totalVotosA);
          data.CandidatoB.push(totalVotosB);
        }
    
        return data;
    }
}
module.exports = GraphicModel;
