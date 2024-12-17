import express from 'express';
import newsService from '../services/news.service.js';

const router = express.Router();

// Utility function to fetch news with categories
async function getNewsWithCategories(newsList) {
    return Promise.all(newsList.map(async (news) => {
        const category = await newsService.findCatByCatId(news.CatID);
        return {
            ...news,
            CatName: category ? category.CatName : 'Chưa có danh mục'
        };
    }));
}

// Reusable route handler for paginated news statuses
async function renderNewsByStatus(req, res, status, viewName) {
    const authorName = req.session.authUser.name;
    const limit = 4;
    const current_page = parseInt(req.query.page) || 1;
    const offset = (current_page - 1) * limit;

    // Fetch the news and paginate
    const allNews = await newsService.getNewsByAuthorStatus(authorName, status);
    const paginatedNews = allNews.slice(offset, offset + limit);

    const newsWithCategories = await getNewsWithCategories(paginatedNews);

    // Pagination calculation
    const totalNews = allNews.length;
    const nPages = Math.ceil(totalNews / limit);
    const pageNumbers = Array.from({ length: nPages }, (_, i) => ({
        value: i + 1,
        active: i + 1 === current_page
    }));

    // Render the view
    res.render(viewName, {
        newsList: newsWithCategories,
        empty: newsWithCategories.length === 0,
        pageNumbers,
        current_page
    });
}

// Homepage route
router.get('/', async function (req,res) {
    const categories = await newsService.getAllCategoriesWithChildren();
    res.render('homepage', {
        categories: categories,
        limitCate: categories.slice(0, 8)
    });
});
// Create article routes
router.get('/create_article', async (req, res) => {
    const categories = await newsService.getAllCategories();
    res.render('vwWriter/create', { categories });
});

router.post('/create_article', async (req, res) => {
    const { title, author, abstract, content, image_url, is_premium, category_id } = req.body;
    await newsService.add({ title, author, abstract, content, image_url, is_premium, category_id });
    res.redirect('/articles');
});

// Get category children
router.get('/categories/children/:CatID', async (req, res) => {
    const categoryChildren = await newsService.getCategoriesChild(req.params.CatID);
    res.json(categoryChildren);
});

// Approved, Published, Rejected, and Pending routes
router.get('/approved', (req, res) => renderNewsByStatus(req, res, 1, 'vwWriter/approved'));
router.get('/published', (req, res) => renderNewsByStatus(req, res, 3, 'vwWriter/approved'));
router.get('/rejected', (req, res) => renderNewsByStatus(req, res, 4, 'vwWriter/rejected'));
router.get('/pending_approval', (req, res) => renderNewsByStatus(req, res, 2, 'vwWriter/rejected'));

export default router;
