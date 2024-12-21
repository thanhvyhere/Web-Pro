import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import categoryRoute from '../routes/category.route.js';
import productRoute from '../routes/product.route.js';
import productUserRoute from '../routes/product-user.route.js';
import accountRoute from '../routes/account.route.js';
import cartRoute from '../routes/cart.route.js';
import miscRoute from '../routes/misc.route.js';

import auth from './auth.mdw.js';

export default function (app) {
  app.get('/', function (req, res) {
    // res.send('Hello World!');
    res.render('home');
  });

  app.get('/about', function (req, res) {
    res.render('about', {
      layout: 'main.hbs'
    });
  });

  app.get('/bs4', function (req, res) {
    res.sendFile(__dirname + '/bs4.html');
  });

  app.get('/err', function (req, res) {
    throw new Error('Error!');
  });

  app.use('/admin/categories', categoryRoute);
  app.use('/admin/products', productRoute);
  app.use('/products', productUserRoute);
  app.use('/account', accountRoute);
  app.use('/cart', auth, cartRoute);
  app.use('/misc', miscRoute);

  app.use(function (req, res, next) {
    res.render('404', { layout: false });
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack)
    // res.status(500).send('Something broke!')
    res.render('500', { layout: false });
  });
}

