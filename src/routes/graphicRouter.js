const express           = require('express');
const router            = express.Router();
const graphicController = require('../controllers/graphicController'); 
const multer            = require('multer');
const upload            = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => { 
    const data = await graphicController.getData(req, res);
    res.render('index', { data });
});

router.post('/update-base', async (req, res) => { 
    await graphicController.updateBaseCounty(req, res) 
});

router.post('/save-csv', upload.single('csv'), async (req, res) => {
    const data = await graphicController.saveCsv(req, res);
    res.json(data);
});

module.exports = router;
