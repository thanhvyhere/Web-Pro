import express from 'express';
import newsService from '../services/news.service.js';

const router = express.Router();
router.get('/', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('homepage', 
       );
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
router.get('/approved', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/approved', 
       );
});

// published
router.get('/published', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/published', 
       );
});
// rejected
router.get('/rejected', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/rejected', 
       );
});
// pending_approval
router.get('/pending_approval', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/pending_approval', 
       );
});
export default router;