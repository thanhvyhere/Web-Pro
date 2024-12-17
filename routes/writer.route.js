import express from 'express';
import newsService from '../services/news.service.js';

const router = express.Router();
router.get('/', async function (req,res) {
    const categories = await newsService.getAllCategoriesWithChildren();
    const limitCate = categories.slice(0, 8);
    res.render('homepage', {
        categories: categories,
        limitCate: limitCate
    });
});

// create_article

router.post('/create_article', async (req, res) => {
    const { title, author, abstract, content, image_url, is_premium, category_id } = req.body;
    
    // Lưu bài viết vào cơ sở dữ liệu với category_id
    await newsService.add({
        title,
        author,
        abstract,
        content,
        image_url,
        is_premium,
        category_id
    });
    res.redirect('/articles');
});

router.get('/create_article', async function (req, res) {
    const categories = await newsService.getAllCategories();
    res.render('vwWriter/create', {
         categories: categories
    });
});
router.get('/categories/children/:CatID', async function (req, res) {
    const categoryId = req.params.CatID;
    const categoryChildren = await newsService.getCategoriesChild(categoryId);
    console.log('category child:');
    console.log(categoryChildren);
    res.json(categoryChildren);  // Trả về dữ liệu dưới dạng JSON
});

// approved
router.get('/approved', async function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    const authorName = req.session.authUser.name;
    //1: approved
    //2: pending
    //3: pushlished
    //4: rejected
    const status = 1;
    const newsApproved = await newsService.getNewsByAuthorStatus(authorName, status);
    const limit = 4;
    const current_page = req.query.page || 1;
    const offset = (current_page - 1) * limit;
    const nRows = newsApproved.length;
    const nPages = Math.ceil(nRows.total / limit);
    const pageNumbers = [];
    for(let i = 0; i < nPages; i++)
    {
        pageNumbers.push({
            value: i + 1,
            active: (i + 1) === +current_page
        });
    }
    const newsWithCategories = await Promise.all(newsApproved.map(async (news) => {
        const category = await newsService.findCatByCatId(news.CatID);  // Lấy thông tin danh mục
        return {
            ...news,
            CatName: category ? category.CatName : 'Chưa có danh mục'
        };
    }));
    // Render trang với thông tin các bài viết và danh mục tương ứng
    res.render('vwWriter/approved', {
        newsApproved: newsWithCategories,
        empty: newsWithCategories.length === 0,
        pageNumbers: pageNumbers,
        //catId: id
    });

});

// published
router.get('/published', async function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    const authorName = req.session.authUser.name;
    const status = 3;
    const newsPublished = await newsService.getNewsByAuthorStatus(authorName, status);
    const newsWithCategories = await Promise.all(newsPublished.map(async (news) => {
        const category = await newsService.findCatByCatId(news.CatID);  // Lấy thông tin danh mục
        return {
            ...news,
            CatName: category ? category.CatName : 'Chưa có danh mục'
        };
    }));

    // Render trang với thông tin các bài viết và danh mục tương ứng
    res.render('vwWriter/approved', {
        newsPublished: newsWithCategories
    });
});
// rejected
router.get('/rejected', async function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    const authorName = req.session.authUser.name;
    const status = 4;
    const newsRejected = await newsService.getNewsByAuthorStatus(authorName, status);
    const newsWithCategories = await Promise.all(newsRejected.map(async (news) => {
        const category = await newsService.findCatByCatId(news.CatID);  // Lấy thông tin danh mục
        return {
            ...news,
            CatName: category ? category.CatName : 'Chưa có danh mục'
        };
    }));
    res.render('vwWriter/rejected', {
        newsRejected: newsWithCategories
    });
});
// pending_approval
router.get('/pending_approval', async function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    const authorName = req.session.authUser.name;
    const status = 2;
    const newsPending = await newsService.getNewsByAuthorStatus(authorName, status);
    const newsWithCategories = await Promise.all(newsPending.map(async (news) => {
        const category = await newsService.findCatByCatId(news.CatID);  // Lấy thông tin danh mục
        return {
            ...news,
            CatName: category ? category.CatName : 'Chưa có danh mục'
        };
    }));
    res.render('vwWriter/rejected', {
        newsPending: newsWithCategories
    });
});

export default router;