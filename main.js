import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import numeral from 'numeral';
import path from 'path'; // Import the 'path' module

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url)); // Sử dụng __dirname với ES module

app.use(express.urlencoded({
    extended: true
}));

app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use('/css', express.static(path.join(__dirname, 'static', 'css')));
app.use('/imgs', express.static(path.join(__dirname, 'static', 'imgs')));


app.get('/', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('homepage');
});

app.get('/login', function (req, res) {
    res.render('account/login', { layout: 'blank-bg' }); 
});

app.get('/register', function (req, res) {
    res.render('account/register', { layout: 'blank-bg' }); 
});

app.get('/change-password', function (req, res) {
    res.render('account/change-pass', { layout: 'blank-bg' }); 
});

app.get('/new-password', function (req, res) {
    res.render('account/new-pass', { layout: 'blank-bg' }); 
});

app.get('/otp', function (req, res) {
    res.render('account/otp', { layout: 'blank-bg' }); 
});

app.listen(3000, function () {
    console.log('newsLand is running on port at http://localhost:3000');
});
