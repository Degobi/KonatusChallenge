const express           = require('express');
const router            = express.Router();
const graphicController = require('../controllers/graphicController'); 

router.get('/', (req, res) => { 
    const data = graphicController.getData(req, res);
    res.render('index', { data });
});

router.post('/update-base', async (req, res) => { await graphicController.updateBaseCounty(req, res) });

module.exports = router;
