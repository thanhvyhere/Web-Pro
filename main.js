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
        }
    }
}));

const __dirname = dirname(fileURLToPath(import.meta.url)); // Sử dụng __dirname với ES module
app.set('view engine', 'hbs');
app.set('views', './views');
app.use('/static', express.static('static'));

configurePassportGithub();
configurePassportGoogle();


app.use(passport.initialize());
app.use(passport.session());
// passport.use('github', configurePassport);


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
        }
    }
}));


app.set('trust proxy', 1)


app.use(async function (req, res, next){
    if(!req.session.auth)
    {
        req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
})
// Thiết lập Handlebars làm view engine




app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
app.use('/images', express.static(path.join(__dirname, 'views', 'images')));
// Node.js với Express: phục vụ các tệp trong thư mục services



app.get('/', async function(req, res) {
    if (req.session.views) {
        req.session.views++;
    } else req.session.views = 1;
    // Render ra giao diện với thông tin album và nghệ sĩ
    res.render('homepage', {
        user: req.session.authUser,
    });
});

import writerRouter from './routes/writer.route.js';
import newspaperRouter from './routes/news.route.js';
app.use('/account', accountRouter);
app.use('/writer', writerRouter);
app.use('/newspaper', newspaperRouter);
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
app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});
