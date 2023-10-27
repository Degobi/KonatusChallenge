// controllers/graficoController.js
const GraficoModel = require('../models/graphicModel');

const graficoModel = new GraficoModel();

exports.getData = async (req, res) => {
    try {
        return dados = await graficoModel.getData();
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateBaseCounty = async (req, res) => {
    try {
        const result = await graficoModel.updateBaseCounty(req, res);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send('Error updating the county database.');
    }
}

exports.saveCsv = async (req, res) => {
    try {
        const data = await graficoModel.saveCsv(req.file);
        return data;
    } catch (error) {
        res.status(500).send('Error!')
    }
}
