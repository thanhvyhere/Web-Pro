import express from 'express';
import editorService from '../services/editor.service.js';
import moment from 'moment';
const router = express.Router();
const role = 'editor';
router.get('/', async function (req,res) 
{
    
    res.render('homepage',);
});

// repository
router.get('/repository', async function (req,res) 
{
    if(req.session.authUser){
        console.log(req.session.authUser.userid)
    }
    else
    {
        return res.redirect('/account/login'); 
    }
    const limit =6;
    const current_page = req.query.page || 1; 
    const offset = (current_page - 1) *limit; 
    const nRows = await editorService.countByNews();
    const nPages = Math.ceil(nRows.total/limit);
    const pageNumbers = [];
    for(let i = 0 ; i < nPages;i++)
        {pageNumbers.push({
            value : i + 1,
            active: ( i + 1) === +current_page
    })}
    const list = await editorService.findPageById(limit,offset);
    res.render('vwEditor/storage', 
        {news: list,
            empty: list.length === 0,
            pageNumbers: pageNumbers, 
        });
});
// reviewed
router.get('/reviewed', async function (req,res) 
{
    if(req.session.authUser){
        console.log(req.session.authUser.userid)
    }
    else
    {
        return res.redirect('/account/login'); 
    }
    const list = await editorService.findReviewed();
    res.render('vwEditor/reviewed', {news: list}
        );
});
// editor_rejected
router.get('/editor_rejected', async function (req,res) 
{
    if(req.session.authUser){
        console.log(req.session.authUser.userid)
    }
    else
    {
        return res.redirect('/account/login'); 
    }
    const list = await editorService.findRejected();
   
    res.render('vwEditor/rejected', {news: list}
        );
});
// editor_approved
router.get('/editor_approved', async function (req,res) 
{
    if(req.session.authUser){
        console.log(req.session.authUser.userid)
    }
    else
    {
        return res.redirect('/account/login'); 
    }
    const list = await editorService.findApproved();
   
    res.render('vwEditor/approved', {news: list}
        );
});
// schedule
router.get('/schedule', async function (req,res) 
{
    if(req.session.authUser){
        console.log(req.session.authUser.userid)
    }
    else
    {
        return res.redirect('/account/login'); 
    }
    try {
        const list = await editorService.findApproved();
        const parentcatList = await editorService.findParentCat();
        const updatedList = list.map(item => ({
            ...item,
            parentCatList: parentcatList, // Gắn parentCatList vào từng phần tử
        }));
        res.render('vwEditor/schedule', { news: updatedList, empty: list.length === 0 });
    } catch (error) {
        console.error('Error:', error); // Ghi lỗi ra console
        res.status(500).send('Internal Server Error');
    }
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
    if(req.session.authUser){
        console.log(req.session.authUser.userid)
    }
    else
    {
        return res.redirect('/account/login'); 
    }
    const id = +req.query.id || 0;
    const news = await editorService.findNewsByID(id)
  
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

    await editorService.update(changes,id)
    res.redirect('/editor/reviewed');
});
router.get('/modify', async function (req,res) 
{
    if(req.session.authUser){
        console.log(req.session.authUser.userid)
    }
    else
    {
        return res.redirect('/account/login'); 
    }
    const id = +req.query.id || 0;
    const news = await editorService.findANews(id)
    const parentcatList = await editorService.findParentCat();
    const tags = await editorService.findTags(id)
    const updatedList = news.map(item => ({
        ...item,
        parentCatList: parentcatList, // Gắn parentCatList vào từng phần tử
        tags: tags
    }));
    
    res.render('vwEditor/editAfterProved', { newsList: updatedList });
});
router.post('/modify', async (req, res) => {
    try {
        const publishedDay = moment(req.body.PublishedDay, "DD/MM/YYYY H:mm").format('YYYY-MM-DD HH:mm');
        const id = req.body.NewsID;
        const tags = req.body.tags || []; 
        
        await editorService.deleteTag(id);

        const changes = {
            PublishedDay: publishedDay,
            CatID: req.body.CatID,
        };
        console.log(changes);
        await editorService.update(changes, id);

        // Bước 3: Thêm các nhãn mới vào bảng news_tags
        for (const tagName of tags) {
            // Kiểm tra xem TagName đã tồn tại trong bảng tag chưa
            const tag = await editorService.findExistingTag(tagName)
           
            if (!tag) {
                const newTag =
                {
                    TagName: tagName
                }
                // Nếu chưa có, thêm TagName vào bảng tag và lấy TagID
                const ret = await editorService.insertTagGetID(newTag);
            }
            const getTagID = await editorService.findTagID(tagName)
           
            // Thêm vào bảng news_tags với NewsID và TagID
            const newsTags =
            {
                TagID: getTagID.TagID,
                NewsID: id
            }
            await editorService.addTagNews(newsTags)
        }

        // Chuyển hướng sau khi xử lý
        res.redirect('/editor/schedule');
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra khi xử lý dữ liệu');
    }
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