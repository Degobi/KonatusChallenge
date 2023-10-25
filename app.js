const express           = require('express');
const app               = express();
const port              = 3000;
const router            = require('./src/routes/graphicRouter');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.use(express.static(__dirname + '/src/views'));

app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
