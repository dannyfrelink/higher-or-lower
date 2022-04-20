const express = require('express');
const app = express();
const PORT = 5151;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(PORT, () => {
    console.log(`Application started on port: http://localhost:${PORT}`);
});