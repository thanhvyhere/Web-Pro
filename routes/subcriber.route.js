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
// library
router.get('/library', async function (req,res) 
{
    res.render('vwSubscriber/library', 
        
    );
});
// downloaded
router.get('/downloaded', async function (req,res) 
{
    res.render('vwSubscriber/downloaded', 
        
    );
});
// premium
router.get('/premium', async function (req,res) 
{
    res.render('vwSubscriber/premium', 
        
    );
});
// favorites
router.get('/favorites', async function (req,res) 
{
    res.render('vwSubscriber/favorites', 
        
    );
});
export default router;