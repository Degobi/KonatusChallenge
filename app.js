const express           = require('express');
const app               = express();
const port              = 3000;
const graphicController = require('./src/controllers/graphicController');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.get('/', (req, res) => {
    const data = graphicController.getData(req, res);
    res.render('index', { data });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
