// controllers/graficoController.js
const GraficoModel = require('../models/graphicModel');

const graficoModel = new GraficoModel();

exports.getData = (req, res) => {
    try {
        return dados = graficoModel.getData();
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
