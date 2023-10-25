const express           = require('express');
const router            = express.Router();
const graphicController = require('../controllers/graphicController'); 

router.get('/', async (req, res) => { await graphicController.getData(req, res)});

//router.get('/outra-rota', graphicController.outraRota);

module.exports = router;
