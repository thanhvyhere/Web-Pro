import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { engine } from 'express-handlebars';
import numeral from 'numeral';
import hbs_sections from 'express-handlebars-sections';
import editorRouter from './routes/editor.route.js';
import accountRouter from './routes/account.route.js'
import configurePassportGithub from './controllers/passportGithub.config.js';
import configurePassportGoogle from './controllers/passportGoogle.config.js';
import moment from 'moment';
import passport from 'passport';
import knex from './utils/db.js';
import writerRouter from './routes/writer.route.js';
import newspaperRouter from './routes/news.route.js';
import subcriberRouter from './routes/subcriber.route.js';
import administratorRouter from './routes/administrator.route.js'
import accountService from './services/account.service.js';
import categoriesRoute from './routes/categories.route.js';
import newsService from './services/news.service.js';
import fnMySQLStore from 'express-mysql-session';
import db from './utils/db.js';

const app = express();
app.use(express.urlencoded({
    extended: true
}));

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     },
    
// }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }));
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        format_number(value) {
            return numeral(value).format('0,0') + ' đ'
        },
        section: hbs_sections(),
        formatDate: function (date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss'); // Định dạng ngày theo YYYY-MM-DD
        },
        skipFirst(array) {
            if (Array.isArray(array)) {
                return array.slice(1); // Bỏ phần tử đầu tiên
            }
            return []; // Nếu không phải mảng, trả về mảng rỗng
        },
        getFirstItem(array) {
            if (Array.isArray(array) && array.length > 0) {
                return array[0];
            }
            return null; // Nếu không có phần tử
        },
    }
}));

const __dirname = dirname(fileURLToPath(import.meta.url)); // Sử dụng __dirname với ES module
app.set('view engine', 'hbs');
app.set('views', './views');
app.use('/static', express.static('static'));
app.use('/css', express.static(path.join(__dirname, 'static', 'css')));
app.use('/imgs', express.static(path.join(__dirname, 'static', 'imgs')));
configurePassportGithub();
configurePassportGoogle();

app.use(passport.initialize());
app.use(passport.session());
// passport.use('github', configurePassport);
app.use(async function (req, res, next){
    if(!req.session.auth)
    {
        req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
})

app.use(async (req, res, next) => {
    // Lấy tất cả categories và limitCate (8 cái đầu tiên)
    const categories = await newsService.getAllCategoriesWithChildren();
    const limitCate = categories.slice(0, 8);

    // Lưu vào res.locals để có thể sử dụng trong tất cả các view
    res.locals.categories = categories;
    res.locals.limitCate = limitCate;

    // Tiếp tục xử lý request
    next();
});


app.get('/', async function (req, res) {
     if (!req.session.auth || !req.session.authUser) {
         return res.render('homepage', {
        }); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
    if (req.session.views) {
        req.session.views++;
    } else req.session.views = 1;

    const permission = req.session.authUser.permission;

    // Redirect users to their respective dashboards
    switch (permission) {
        case 2: // Subscriber
            return res.redirect('/subscriber');
        case 3: // Writer
            return res.redirect('/writer');
        case 4: // Editor
            return res.redirect('/editor');
        case 5: // Admin
            return res.redirect('/administrator');
        default: // Guest or invalid permission
            return res.redirect('/');
    }
});
app.use(async function (req, res, next) {
    let roleNum = req.session.authUser ? req.session.authUser.permission : 1;
    let rolePort;
    switch (roleNum) {
        case 2: // Subscriber
            rolePort = 'subscriber';
            break;
        case 3: // Writer
            rolePort = 'writer';
            break;
        case 4: // Editor
            rolePort = 'editor';
            break;
        case 5: // Admin
            rolePort = 'administrator';
            break;
    }
     if (rolePort === 'editor' || rolePort === 'administrator'||rolePort === 'writer' || rolePort === 'subscriber') {
        try {
            const permission = await accountService.findbyrolename(rolePort);
            const roleFeature = await accountService.roleFeature(permission.RoleID);
            res.locals.lcFeatureRoles = roleFeature;
        } catch (error) {
            console.error(`Lỗi khi lấy dữ liệu cho port: ${rolePort}`, error);
        }
    }
    next();
});

app.use('/account', accountRouter);
app.use('/writer', writerRouter);
app.use('/newspaper', newspaperRouter);
app.use('/categories', categoriesRoute);
//

app.use('/role', editorRouter);
app.get('/login', function (req, res) {
    res.render('account/login', { layout: 'blank-bg' }); 
});

app.get('/register', function (req, res) {
    res.render('account/register', { layout: 'blank-bg' }); 
});


app.use('/editor', editorRouter);
app.use('/subscriber', subcriberRouter);
app.use('/administrator', administratorRouter);
app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});
