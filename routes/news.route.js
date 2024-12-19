
import express from 'express';
import newsService from '../services/news.service.js';
import moment from 'moment';
import auth from '../middleware/auth.mdw.js';
const router = express.Router();


router.get('/byCat', async function (req, res) {
    const catId = req.query.catId || 0;
    const category = await newsService.findCatByCatId(catId);
    const limit = 6;

    // Kiểm tra và giới hạn current_page
    const nRows = await newsService.countByCatId(catId);
    const nPages = Math.ceil(nRows.total / limit);
    const current_page = Math.max(1, Math.min(req.query.page || 1, nPages)); // Đảm bảo từ 1 đến nPages
    const offset = (current_page - 1) * limit;

    // Tạo danh sách số trang
    const pageNumbers = [];
    for (let i = 0; i < nPages; i++) {
        pageNumbers.push({
            value: i + 1,
            active: (i + 1) === +current_page
        });
    }
    
    // Lấy danh sách bản tin theo trang
    const list = await newsService.findPageByCatId(catId, limit, offset);
    const updatedList = await Promise.all(list.map(async (item) => {
        let is_premium;
        const auth = req.session.auth;
        if (item.Premium === 1)
            is_premium = true;
        else
            is_premium = false;
        return{
            ...item,
            catName: category.CatName,
            is_premium,
            auth
        }
    }));

    // Render view
    res.render('vwNewspaper/byCat', {
        news: updatedList,
        empty: list.length === 0,
        pageNumbers: pageNumbers,
        catId: catId
    });
});


router.get('/detail',  async function (req, res) {
    const id = req.query.id || 0;
    await newsService.incrementViewCount(id);
    const tags = await newsService.getTagByNewsId(id);
    const comments = await newsService.getAllCommentById(id);
    const news = await newsService.findById(id);
    const count = await newsService.countCommentBynewsId(id);
    res.render('vwNewspaper/detail', {
        news: news,
        NewsID: id,
        tags: tags,
        comments: comments,
        countComment: count.total
    });
});

router.get('/edit', async function (req, res) {
    const id = +req.query.id || 0; // + o trc de chuyen kieu du lieu ve so
    const entity = await newsService.findById(id);
    console.log(id);
    const tags = await newsService.getTagByNewsId(id);
    console.log("tags: ", tags);
    const category_con = await newsService.findCatByCatId(entity.CatID);
    const category_cha = await newsService.findCatByCatId(category_con.parent_id)
    if (!entity) {
        return res.redirect('/');
    }
    res.render('vwNewspaper/edit', {
        news: entity,
        categoryCha: category_cha,
        categoryCon: category_con,
        tags: tags
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
    await newsService.delTagByNewsId(id);
    const { tags } = req.body;
    const date = new Date();
    const changes = {
        Title: req.body.title,
        CreatedDate: date,
        CatID: req.body.CatID,
        ImageCover: req.body.ImagePath,
        Content: req.body.content,
        Status: 2
    }
    await newsService.patch(id, changes);
    
    let parsedTags = tags;
    if (typeof tags === 'string') {
        parsedTags = JSON.parse(tags);
    }
    for (let tag of parsedTags) {
        let tagValue = tag.value;

        // Kiểm tra nếu tag đã tồn tại trong cơ sở dữ liệu
        let existingTag = await newsService.findTagByTagName(tagValue); 
        if (!existingTag) {
            let newTag = {
                TagName: tagValue
            };
            // Lưu tag mới vào database
            await newsService.addNewTag(newTag);
            existingTag = await newsService.findTagByTagName(tagValue);
        }

        // Tạo mối quan hệ giữa tag và bài viết
        const tagNewsEntity = {
            TagID: existingTag.TagID,
            NewsID: id
        };

        await newsService.addTagIdAndNewsId(tagNewsEntity);
    }

    res.redirect('/writer/pending_approval?success=Update%20successful!');
});

router.get('/api/tags', async (req, res) => {
    try {
        const tags = await newsService.getAllTags(); // Lấy danh sách tags từ database
        console.log(tags);
        res.json(tags); // Trả về danh sách tags
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

router.post('/comment', auth, async function (req, res) {
    const entity = {
        Comment: req.body.comment,
        NewsID: req.body.id,
        UserID: req.session.authUser.userid,
        CreatedDate: new Date()
    }
    await newsService.addComment(entity);
    res.redirect(req.headers.referer);
})


export default router;