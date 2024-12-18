import express from 'express';
import editorService from '../services/editor.service.js';
import moment from 'moment';
import { console } from 'inspector';
const router = express.Router();
const role = 'editor';
router.get('/', async function (req,res) 
{
    
    res.render('homepage',);
});

// repository
router.get('/repository', async function (req,res) 
{
    const list = await editorService.findAll();
    res.render('vwEditor/storage', 
        {news: list});
});
// reviewed
router.get('/reviewed', async function (req,res) 
{
    const list = await editorService.findReviewed();
    res.render('vwEditor/reviewed', {news: list}
        );
});
// editor_rejected
router.get('/editor_rejected', async function (req,res) 
{
    const list = await editorService.findRejected();
    res.render('vwEditor/rejected', {news: list}
        );
});
// editor_approved
router.get('/editor_approved', async function (req,res) 
{
    const list = await editorService.findApproved();
    res.render('vwEditor/approved', {news: list}
        );
});
// schedule
router.get('/schedule', async function (req,res) 
{
    const list = await editorService.findApproved();
    const parentcatList = await editorService.findParentCat();
    const updatedList = list.map(item => ({
        ...item,
        parentCatList: parentcatList  // Gắn parentCatList vào từng phần tử
    }));
   
    res.render('vwEditor/schedule', {news: updatedList});
});
router.post('/schedule', async function (req,res) 
{
    const publishedDay = moment(req.body.PublishedDay, "DD/MM/YY H:i").format('YYYY-MM-DD HH:mm')
    const id = req.body.NewsID;
    const changes = {
        PublishedDay: publishedDay,
        CatID: req.body.CatID,
    }
    await editorService.update(changes,id)
    res.redirect('/editor/schedule');
});
router.get('/getChildCategories/:parentCatId', async (req, res) => {
    const parentCatId = req.params.parentCatId;
    
    try {
        const childCat = await editorService.findChildCat(parentCatId);
        if (!childCat || childCat.length === 0) {
            // Nếu không có dữ liệu, trả về một thông báo hợp lệ
            return res.status(200).json([]);
        }
        res.status(200).json(childCat);
    }
    catch(error)
     {
        console.error('Lỗi khi truy xuất danh mục con:', error);
        res.status(500).send('Lỗi server');
    }
});
router.get('/feedback', async function (req,res) 
{
    const id = +req.query.id || 0;
    const news = await editorService.findANews(id)
    res.render('vwEditor/feedback', { newsList: news });
});
router.post('/feedback', async function (req,res) 
{
    const id = req.body.NewsID;
    const changes =
    {
        Feedback: req.body.Feedback,
        Status: req.body.Status,
    }
    console.log(changes)
    console.log(id)
    await editorService.update(changes,id)
    res.redirect('/editor/reviewed');
});
router.post('/update-status', async function (req, res) {
   
    const id= req.body.id;
    const status = 
    {
        Status:req.body.status
    }
    console.log('Received body:', req.body); // Kiểm tra xem dữ liệu có đến server không
    if (!req.body) {
        return res.json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    try {
        console.log('Updating with ID:', id, 'and Status:', status);
        // Cập nhật trạng thái trong database
        await editorService.update(status, id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: id });
    }
});
export default router;