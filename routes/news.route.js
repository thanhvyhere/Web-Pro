
import express from 'express';
import newsService from '../services/news.service.js';
import moment from 'moment';
const router = express.Router();


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

router.get('/edit', async function (req, res) {
    const id = +req.query.id || 0; // + o trc de chuyen kieu du lieu ve so
    const entity = await newsService.findById(id);
    const category = await newsService.findCatByCatId(entity.CatID);
    if (!entity) {
        return res.redirect('/');
    }
    res.render('vwNewspaper/edit', {
        news: entity,
        CatName: category.CatName
    });
});

router.post('/del', async function (req, res) {
    try {
        await newsService.del(req.body.newsId);
        res.redirect('/?message=success'); // Thêm thông báo vào query string
    } catch (error) {
        res.redirect('/?message=error'); // Thêm thông báo lỗi
    }
});



router.post('/patch', async function (req, res) {
    const id = req.body.newsId;
    const date = new Date();
    const changes = {
        Title: req.body.title,
        CreatedDate: date,
        AuthorName: req.session.authUser.name,
        CatID: req.body.CatID,
        ImageCover: req.body.ImagePath,
        Content: req.body.content,
        Status: 2
    }
    await newsService.patch(id, changes);
    res.redirect('/');
});

router.get('/api/tags', async (req, res) => {
    try {
        const tags = await newsService.getAllTags(); // Lấy danh sách tags từ database
        res.json(tags.map(tag => tag.name)); // Trả về danh sách tags
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});
router.post('/api/tags', async (req, res) => {
    const { tags } = req.body; // Lấy danh sách tags từ request body
    try {
        const savedTags = [];
        for (const tag of tags) {
            // Kiểm tra nếu tag đã tồn tại
            const existingTag = await newsService.findTagByTagName(tag.TagName);
            if (!existingTag) {
                // Lưu tag mới vào database
                await newsService.addNewTag(tag);
                savedTags.push(newTag);
            }
        }
        res.status(201).json({ message: 'Tags saved successfully', tags: savedTags });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save tags' });
    }
});


export default router;