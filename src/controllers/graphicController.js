// controllers/graficoController.js
const GraficoModel = require('../src/models/graphicModel');

const graficoModel = new GraficoModel();

exports.obterDados = (req, res) => {
    return dados = graficoModel.getDados();
};
