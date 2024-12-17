import express from 'express';
//import AdministratorService from '../services/Administrator.service.js';
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

router.get('/manage_categories', async function (req,res) 
{
   
    res.render('vwAdministrator/categories', 
        
    );
});
// manage_tags
router.get('/manage_tags', async function (req,res) 
{
    res.render('vwAdministrator/tags', 
        
    );
});
// manage_articles
router.get('/manage_articles', async function (req,res) 
{
   
    res.render('vwAdministrator/articles', 
        
    );
});
// manage_users
router.get('/manage_users', async function (req,res) 
{
   
    res.render('vwAdministrator/users', 
        
    );
});
export default router;