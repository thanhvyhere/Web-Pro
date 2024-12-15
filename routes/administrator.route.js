import express from 'express';
//import AdministratorService from '../services/Administrator.service.js';
const router = express.Router();
router.get('/', async function (req,res) 
{
    res.render('homepage', 
        
    );
});
// manage_categories
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