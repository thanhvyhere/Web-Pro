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
import newsService from './services/news.service.js';
import fnMySQLStore from 'express-mysql-session';
import readerRouter from './routes/reader.route.js';
import { checkPremium } from './middleware/auth.mdw.js';

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json()); 

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

        getRoleIcon(roleName) {
            // Trả về icon HTML tương ứng với roleName
            switch (roleName) {
                case 'administrator':
                    return '<i class="bi bi-shield-lock"></i>'; // Icon cho Administrator
                case 'editor':
                    return '<i class="bi bi-pencil-square"></i>'; // Icon cho Editor
                case 'subscriber':
                    return '<i class="bi bi-person"></i>'; // Icon cho Subscriber
                case 'writer':
                    return '<i class="bi bi-vector-pen"></i>'; // Icon cho Subscriber
                default:
                    return '<i class="bi bi-person-fill"></i>'; // Icon mặc định
            }
        },

        getStatusColor(status) {
            switch (status) {
                case 'Đang chờ':
                    return 'gray'; // Màu xám
                case 'Đã đăng':
                    return 'green'; // Màu xanh
                case 'Đã xóa':
                    return 'red'; // Màu đỏ
                case 'Đã nhận xét':
                    return 'orange'; // Màu vàng
                case 'Đã chỉnh sửa':
                    return 'purple'; // Màu vàng
                case 'Đã duyệt':
                    return 'yellow'; // Màu vàng
                case 'Đã từ chối':
                    return 'blue'; // Màu vàng
                default:
                    return 'black'; // Màu mặc định
            }
        },

        eq: function (a, b) {
            return a === b;
        },

        json: function (context) {
            return JSON.stringify(context);
        }, 

        or: function (...args) {
            args.pop(); // Xóa `options` của Handlebars
            return args.some(Boolean); // Trả về `true` nếu bất kỳ giá trị nào trong args là `true`
        },

        eq: function (a, b) {
            return a === b;  // So sánh a và b, trả về true nếu bằng nhau
        },

        gt: function (a, b) {
            return a > b;
        },
          
        lt: function (a, b) {
            return a < b;
        },
          
        // Helper: Phép cộng và trừ
        add: function (a, b) {
            return a + b;
        },
          
        sub: function (a, b) {
            return a - b;
        },

        range: function (start, end) {
            let result = [];
            for (let i = start; i <= end; i++) {
              result.push(i);
            }
            return result;
        },

        limit: function (array, limit) {
            if (!Array.isArray(array)) {
                return [];
            }
            return array.slice(0, limit);
        },

        skip: function(arr, n) {
            return arr.slice(n); // Sử dụng slice để cắt bỏ n phần tử đầu tiên
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

app.use(async function (req, res, next) {
    if (!req.session.auth) {
        req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser || null; // Đảm bảo authUser luôn có giá trị
    if (req.session.authUser && req.session.authUser.permission > 1) {
        res.locals.authPremium = true;
    } else {
        res.locals.authPremium = false;
    }
    // Kiểm tra authUser trước khi truy cập thuộc tính permission
   

    next();
});

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

app.use(async (req, res, next) => {
    const topNews = await newsService.getTop3NewsByView();
    
        // Đếm số lượng bình luận cho từng bài báo trong top3 và lấy tên danh mục
       const updatedList = await Promise.all(topNews.map(async (item) => {
           const count = await newsService.countCommentBynewsId(item.NewsID);
           const tags = await newsService.getTagByNewsId(item.NewsID);
           return {
               ...item,
               countComment: count.total, // Đảm bảo trả về đúng số lượng bình luận
               tags:tags
           }
       }));
    res.locals.topNews = updatedList;
    next();
});

app.use(async (req, res, next) => {
    const topCat = await newsService.getTop10Cat();
    res.locals.topCat = topCat;
    next();
});

app.use(async (req, res, next) => {
    const newNews = await newsService.getTop10NewsByDate();
       const updatedList = await Promise.all(newNews.map(async (item) => {
           const count = await newsService.countCommentBynewsId(item.NewsID);
           const tags = await newsService.getTagByNewsId(item.NewsID);
           return {
               ...item,
               countComment: count.total, // Đảm bảo trả về đúng số lượng bình luận
               tags:tags
           }
       }));
    res.locals.newNews = updatedList;
    next();
});

app.use(async (req, res, next) => {
    const viewsNews = await newsService.getTop10NewsByViews();
       const updatedList = await Promise.all(viewsNews.map(async (item) => {
           const count = await newsService.countCommentBynewsId(item.NewsID);
           const tags = await newsService.getTagByNewsId(item.NewsID);
           return {
               ...item,
               countComment: count.total, // Đảm bảo trả về đúng số lượng bình luận
               tags:tags
           }
       }));
    res.locals.viewsNews = updatedList;
    next();
});

app.use(async (req, res, next) => {
    const randomNews = await newsService.getTop3NewsByRandom();
       const updatedList = await Promise.all(randomNews.map(async (item) => {
           const count = await newsService.countCommentBynewsId(item.NewsID);
           const tags = await newsService.getTagByNewsId(item.NewsID);
           return {
               ...item,
               countComment: count.total, // Đảm bảo trả về đúng số lượng bình luận
               tags:tags
           }
       }));
    res.locals.randomNews = updatedList;
    next();
});

app.get('/', checkPremium, async function (req, res) {
   if (!req.session.auth || !req.session.authUser) {
        // Truyền dữ liệu vào view
        return res.render('homepage');
    }

    if (req.session.views) {
        req.session.views++;
    } else req.session.views = 1;

    
    const permission = req.session.authUser.permission;

    // Redirect users to their respective dashboards
    switch (permission) {
        case 1: 
            return res.redirect('/reader')
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
            res.locals.roleName = rolePort;
        } catch (error) {
            console.error(`Lỗi khi lấy dữ liệu cho port: ${rolePort}`, error);
        }
    }
    next();
});

app.use('/account', accountRouter);
app.use('/writer', writerRouter);
app.use('/newspaper', newspaperRouter);
// Khởi động server
// app.use('/artist', artistRouter);
app.use('/reader', readerRouter)
app.use('/role', editorRouter);
app.use('/editor', editorRouter);
app.use('/subscriber', checkPremium, subcriberRouter);
app.use('/administrator', administratorRouter);

app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});
