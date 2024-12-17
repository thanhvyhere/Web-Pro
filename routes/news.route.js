
import express from 'express';
import newsService from '../services/news.service.js';
import moment from 'moment';
const router = express.Router();


// router.get('/byCat', async function (req, res) {
//     const id = req.query.id || 0;
//     const list = await newsService.findByCatId(id);
//     res.render('vwNewspaper/byCat', {
//         products: list,
//         empty: list.length === 0
//     })
// });
//products/byCat?id=6&offset=4
//products/byCat?id=6&page=2
router.get('/byCat', async function (req, res) {
    const catId = req.query.catId || 0;
    const category = await newsService.findCatByCatId(catId);
    const limit = 4;
    const current_page = req.query.page || 1;
    const offset = (current_page - 1) * limit;
    const nRows = await newsService.countByCatId(catId);
    const nPages = Math.ceil(nRows.total / limit);
    const pageNumbers = [];
    for(let i = 0; i < nPages; i++)
    {
        pageNumbers.push({
            value: i + 1,
            active: (i + 1) === +current_page
        });
    }
    const list = await newsService.findPageByCatId(catId, limit, offset);
    const updatedList = list.map(item => ({
        ...item,
       catName: category.CatName,
    }));
   
    res.render('vwNewspaper/byCat', {
        news: updatedList,
        empty: list.length === 0,
        pageNumbers: pageNumbers,
        
        catId: catId
    });
});

router.get('/detail', async function (req, res) {
    const id = req.query.id || 0;
    const news = await newsService.findById(id);
    res.render('vwNewspaper/detail', {
        news: news
    });
});



export default router;