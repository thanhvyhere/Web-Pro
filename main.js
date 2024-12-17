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
app.use(async function (req, res, next){
    if(!req.session.auth)
    {
        req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
})

app.get('/', async function (req, res) {
     if (!req.session.auth || !req.session.authUser) {
        return res.render('homepage'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
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
            return res.redirect('/admin');
        default: // Guest or invalid permission
            return res.redirect('/');
    }
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
app.use('/categories', categoriesRoute);
// Khởi động server
// app.use('/artist', artistRouter);

// Route cho các trang ở thanh Nav-bar
// Route để hiển thị danh sách bài viết theo thể loại
app.get('/life', async (req, res) => {
    try {
        // Lọc bài viết theo thể loại "life"
        const articles = await knex('articles').where('category', 'life').select('*');

        // Kiểm tra có nhận được articles hay không
        if (!articles || articles.length === 0) {
            throw new Error('No articles found');
        }

        // Nhóm bài viết theo category (nếu cần thiết, nếu không có thể bỏ qua bước này)
        const articlesGroupedByCategory = articles.reduce((acc, article) => {
            if (!acc[article.category]) {
                acc[article.category] = [];
            }
            acc[article.category].push(article);
            return acc;
        }, {});

        // Chuyển đổi từ object sang array để render
        const groupedArray = Object.keys(articlesGroupedByCategory).map(key => ({
            category: key,
            articles: articlesGroupedByCategory[key]
        }));

        // Render view với dữ liệu đã nhóm (hoặc trực tiếp bài viết nếu không cần nhóm)
        res.render('life', { articles: groupedArray });

    } catch (error) {
        // Xử lý lỗi khi xảy ra
        console.error('Error fetching articles:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route cho Chính trị
app.get('/politics', async (req, res) => {
    try {
        // Lọc bài viết theo thể loại "politics"
        const articles = await knex('articles').where('category', 'politics').select('*');

        // Kiểm tra có nhận được articles hay không
        if (!articles || articles.length === 0) {
            throw new Error('No articles found');
        }

        // Nhóm bài viết theo category (nếu cần thiết, nếu không có thể bỏ qua bước này)
        const articlesGroupedByCategory = articles.reduce((acc, article) => {
            if (!acc[article.category]) {
                acc[article.category] = [];
            }
            acc[article.category].push(article);
            return acc;
        }, {});

        // Chuyển đổi từ object sang array để render
        const groupedArray = Object.keys(articlesGroupedByCategory).map(key => ({
            category: key,
            articles: articlesGroupedByCategory[key]
        }));

        // Render view với dữ liệu đã nhóm (hoặc trực tiếp bài viết nếu không cần nhóm)
        res.render('politics', { articles: groupedArray });

    } catch (error) {
        // Xử lý lỗi khi xảy ra
        console.error('Error fetching articles:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route cho các thể thao
// Route cho thể loại football
app.get('/sports/football', async (req, res) => {
    try {
        // Lọc bài viết theo thể loại "football"
        const articles = await knex('articles').where('category', 'football').select('*');

        // Kiểm tra có nhận được articles hay không
        if (!articles || articles.length === 0) {
            throw new Error('No articles found');
        }

        // Nhóm bài viết theo category (nếu cần thiết, nếu không có thể bỏ qua bước này)
        const articlesGroupedByCategory = articles.reduce((acc, article) => {
            if (!acc[article.category]) {
                acc[article.category] = [];
            }
            acc[article.category].push(article);
            return acc;
        }, {});

        // Chuyển đổi từ object sang array để render
        const groupedArray = Object.keys(articlesGroupedByCategory).map(key => ({
            category: key,
            articles: articlesGroupedByCategory[key]
        }));

        // Render view với dữ liệu đã nhóm
        res.render('football', { articles: groupedArray });

    } catch (error) {
        // Xử lý lỗi khi xảy ra
        console.error('Error fetching articles:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route cho thể loại basketball
app.get('/sports/basketball', async (req, res) => {
    try {
        // Lọc bài viết theo thể loại "basketball"
        const articles = await knex('articles').where('category', 'basketball').select('*');

        // Kiểm tra có nhận được articles hay không
        if (!articles || articles.length === 0) {
            throw new Error('No articles found');
        }

        // Nhóm bài viết theo category
        const articlesGroupedByCategory = articles.reduce((acc, article) => {
            if (!acc[article.category]) {
                acc[article.category] = [];
            }
            acc[article.category].push(article);
            return acc;
        }, {});

        // Chuyển đổi từ object sang array để render
        const groupedArray = Object.keys(articlesGroupedByCategory).map(key => ({
            category: key,
            articles: articlesGroupedByCategory[key]
        }));

        // Render view với dữ liệu đã nhóm
        res.render('basketball', { articles: groupedArray });

    } catch (error) {
        // Xử lý lỗi khi xảy ra
        console.error('Error fetching articles:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route cho thể loại volleyball
app.get('/sports/volleyball', async (req, res) => {
    try {
        // Lọc bài viết theo thể loại "volleyball"
        const articles = await knex('articles').where('category', 'volleyball').select('*');

        // Kiểm tra có nhận được articles hay không
        if (!articles || articles.length === 0) {
            throw new Error('No articles found');
        }

        // Nhóm bài viết theo category
        const articlesGroupedByCategory = articles.reduce((acc, article) => {
            if (!acc[article.category]) {
                acc[article.category] = [];
            }
            acc[article.category].push(article);
            return acc;
        }, {});

        // Chuyển đổi từ object sang array để render
        const groupedArray = Object.keys(articlesGroupedByCategory).map(key => ({
            category: key,
            articles: articlesGroupedByCategory[key]
        }));

        // Render view với dữ liệu đã nhóm
        res.render('volleyball', { articles: groupedArray });

    } catch (error) {
        // Xử lý lỗi khi xảy ra
        console.error('Error fetching articles:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route cho Bất động sản
app.get('/realestate', async (req, res) => {
    try {
        // Lọc bài viết theo thể loại "realestate"
        const articles = await knex('articles').where('category', 'realestate').select('*');

        // Kiểm tra có nhận được articles hay không
        if (!articles || articles.length === 0) {
            throw new Error('No articles found');
        }

        // Nhóm bài viết theo category (nếu cần thiết, nếu không có thể bỏ qua bước này)
        const articlesGroupedByCategory = articles.reduce((acc, article) => {
            if (!acc[article.category]) {
                acc[article.category] = [];
            }
            acc[article.category].push(article);
            return acc;
        }, {});

        // Chuyển đổi từ object sang array để render
        const groupedArray = Object.keys(articlesGroupedByCategory).map(key => ({
            category: key,
            articles: articlesGroupedByCategory[key]
        }));

        // Render view với dữ liệu đã nhóm (hoặc trực tiếp bài viết nếu không cần nhóm)
        res.render('realestate', { articles: groupedArray });

    } catch (error) {
        // Xử lý lỗi khi xảy ra
        console.error('Error fetching articles:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/sports', async (req, res) => {
    try {
        // Lọc bài viết theo các thể loại thể thao
        const articles = await knex('articles')
            .whereIn('category', ['football', 'basketball', 'volleyball'])
            .select('*');

        // Kiểm tra có nhận được articles hay không
        if (!articles || articles.length === 0) {
            throw new Error('No articles found');
        }

        // Nhóm bài viết theo thể loại thể thao
        const articlesGroupedByCategory = articles.reduce((acc, article) => {
            if (!acc[article.category]) {
                acc[article.category] = [];
            }
            acc[article.category].push(article);
            return acc;
        }, {});

        // Chuyển đổi từ object sang array để render
        const groupedArray = Object.keys(articlesGroupedByCategory).map(key => ({
            category: key,
            articles: articlesGroupedByCategory[key]
        }));

        // Render view với dữ liệu đã nhóm (hoặc trực tiếp bài viết nếu không cần nhóm)
        res.render('sports', { articles: groupedArray });

    } catch (error) {
        // Xử lý lỗi khi xảy ra
        console.error('Error fetching articles:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/article/:id', async (req, res) => {
    try {
        const articleId = req.params.id; // Lấy id từ URL
        const article = await knex('articles').where('id', articleId).first(); // Lấy bài viết theo id

        if (!article) {
            throw new Error('Article not found');
        }

        // Render trang detail với dữ liệu bài viết
        res.render('detail', { article });

    } catch (error) {
        // Xử lý lỗi nếu bài viết không tồn tại hoặc có lỗi khi lấy dữ liệu
        console.error('Error fetching article:', error);
        res.status(500).send('Internal Server Error');
    }
});

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
