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
import writerRouter from './routes/writer.route.js';
import newspaperRouter from './routes/news.route.js';
import subcriberRouter from './routes/subcriber.route.js';
import administratorRouter from './routes/administrator.route.js'
import accountService from './services/account.service.js';

const app = express();
app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    
}))

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

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {} 
}))

app.use(async function (req, res, next){
    if(!req.session.auth)
    {
        req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
})



app.get('/', async function(req, res) {
    if (req.session.views) {
        req.session.views++;
    } else req.session.views = 1;
    //đang để permission cứng để test thôi sau tìm cách để cập nhật theo user
    const permission = 2;
    const role = await accountService.roleFeature(permission);
    // Render ra giao diện với thông tin album và nghệ sĩ
    res.render('homepage', {
        user: req.session.authUser,
        roleName:role.RoleName,
    });
});
app.use(async function(req,res,next){
    const rolePort = req.path.split('/')[1]; 
     if (rolePort === 'editor' || rolePort === 'administrator'||rolePort === 'writer' || rolePort === 'subscriber') {
        try {
            const permission = await accountService.findbyrolename(rolePort);
            const roleFeature = await accountService.roleFeature(permission.RoleID);
            res.locals.lcFeatureRoles = roleFeature;
            console.log(roleFeature);
        } catch (error) {
            console.error(`Lỗi khi lấy dữ liệu cho port: ${rolePort}`, error);
        }
    }
    // Tiến hành tiếp tục xử lý middleware cho các đường dẫn khác
    next();
});

app.use('/account', accountRouter);
app.use('/writer', writerRouter);
app.use('/newspaper', newspaperRouter);
// Khởi động server
// app.use('/artist', artistRouter);


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
