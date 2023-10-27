const GraficoModel = require('../models/graphicModel');
const graficoModel = new GraficoModel();

exports.getData = async (req, res) => {
    try {
        return dados = await graficoModel.getData();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao obter os dados.' });
    }
};

exports.updateBaseCounty = async (req, res) => {
    try {
        const result = await graficoModel.updateBaseCounty(req, res);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).send('Erro ao atualizar o banco de dados.');
    }
}

exports.saveCsv = async (req, res) => {
    try {
        const data = await graficoModel.saveCsv(req.file);
        return data;
    } catch (error) {
        return res.status(500).send('Erro ao salvar pesquisa!');
    }
}
