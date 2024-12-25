
import express from 'express';
import newsService from '../services/news.service.js';
import moment from 'moment';
import auth from '../middleware/auth.mdw.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
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
        const authPremium = req.session.authPremium;
        const auth = req.session.auth;
        const tag = await newsService.getTagByNewsId(item.NewsID);
        if (item.Premium === 1)
            is_premium = true;
        else
            is_premium = false;
        return{
            ...item,
            catName: category.CatName,
            is_premium,
            auth,
            authPremium,
            tag
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

router.get('/byTag', async function (req, res) {
    const tagId = req.query.id || 0;
    const limit = 6;
    const nRows = await newsService.countByTagId(tagId);
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
    const list = await newsService.findPageByTagId(tagId, limit, offset);
    // Lấy danh sách bản tin theo trang
    const updatedList = await Promise.all(list.map(async (item) => {
        let is_premium;
        const auth = req.session.auth;
        const authPremium = req.session.authPremium;
        const tag = await newsService.getTagByNewsId(item.NewsID);
        if (item.Premium === 1)
            is_premium = true;
        else
            is_premium = false;
        const category = await newsService.findCatByCatId(item.CatID);
        return{
            ...item,
            catName: category.CatName,
            is_premium,
            authPremium,
            auth,
            tag
        }
    }));

    // Render view
    res.render('vwNewspaper/byTag', {
        news: updatedList,
        empty: list.length === 0,
        pageNumbers: pageNumbers,
        tagId: tagId
    });
});


router.get('/detail',  async function (req, res) {
    const id = req.query.id || 0;
    await newsService.incrementViewCount(id);
    const tags = await newsService.getTagByNewsId(id);
    const comments = await newsService.getAllCommentById(id);
    const news = await newsService.findById(id);
    const randomNewsCat = await newsService.getTop3NewsCateByRandom(news.CatID);
    const count = await newsService.countCommentBynewsId(id);
    res.render('vwNewspaper/detail', {
        news: news,
        NewsID: id,
        tags: tags,
        comments: comments,
        countComment: count.total,
        randomNewsCat
    });
});
router.get('/detail-raw',  async function (req, res) {
    const id = req.query.id || 0;
    await newsService.incrementViewCount(id);
    const tags = await newsService.getTagByNewsId(id);
    const news = await newsService.findById(id);
    res.render('vwNewspaper/detail-raw', {
        news: news,
        NewsID: id,
        tags: tags,
    });
});

router.get('/edit', async function (req, res) {
    const id = +req.query.id || 0; // + o trc de chuyen kieu du lieu ve so
    const entity = await newsService.findById(id);
    const tags = await newsService.getTagByNewsId(id);
    const category_con = await newsService.findCatByCatId(entity.CatID);
    if(entity.CatID === 0)
    {
        return res.status(400).send('Lỗi dữ liệu không có danh mục.');
    }else
    {
    const category_cha = await newsService.findCatByCatId(category_con.parent_id)
    const image = entity.ImageCover;
    let imageFile = image; // Khởi tạo giá trị mặc định

    if (!entity) {
        return res.redirect('/');
    }
    res.render('vwNewspaper/edit', {
        news: entity,
        categoryCha: category_cha,
        categoryCon: category_con,
        tags: tags,
        imageFile: imageFile,
        });
    }

});

router.post('/del',  async function (req, res) {
    try {
        await newsService.del(req.body.newsId);
        res.redirect('/?message=success'); // Thêm thông báo vào query string
    } catch (error) {
        res.redirect('/?message=error'); // Thêm thông báo lỗi
    }
});


const upload = multer({ dest: './static/imgs/news/' })
router.post('/patch',upload.single('ImageFile'), async function (req, res) {
    const imagePath = './static/imgs/news/';
    const imageFile = req.file; // Lấy file upload từ multer
    const number = await newsService.countByNews();
    
    let finalImages = [];
    let coverImage;

    // Nếu có file tải lên
    if (imageFile) {
        const fileName = `news_${number[0].total}.jpg`; // Tạo tên file mới
        const newFilePath = path.join(imagePath, fileName);

        // Đổi tên file để lưu đúng chuẩn
        fs.renameSync(imageFile.path, newFilePath);

        // Đường dẫn đầy đủ cho ảnh vừa tải
        finalImages.push(`/static/imgs/news/${fileName}`);
        coverImage = finalImages[0]; // Ảnh bìa là ảnh đầu tiên
    } else {
        // Không có file tải lên, giữ nguyên ImageCover từ body
        coverImage = req.body.ImageCover; // Giá trị cũ từ form (được gửi lên từ client)
    }
    const id = req.body.newsId;
    await newsService.delTagByNewsId(id);
    const { tags } = req.body || "";
    const date = new Date();
    const changes = {
        Title: req.body.title,
        CreatedDate: date,
        CatID: req.body.CatID,
        ImageCover: coverImage,
        Content: req.body.content,
        Status: 2
    }
    await newsService.patch(id, changes);
    if (tags === "") {
        res.redirect('/writer/pending_approval?success=Update%20successful!');
    }
    else {
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
    }
    }
);

router.get('/api/tags', async (req, res) => {
    try {
        const tags = await newsService.getAllTags(); // Lấy danh sách tags từ database
        res.json(tags); // Trả về danh sách tags
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});
router.get('/api/search', async (req, res) => {
    const keyword = req.query.keyword;

    if (!keyword.trim()) {
        return res.json([]); // Trả về mảng rỗng nếu không có từ khóa
    }
    try {
        const results = await newsService.searchArticle(keyword);
        res.json(results); // Trả về kết quả dưới dạng JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching search results');
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
});

router.get('/update-status', async function (req, res) {
    try {
        // Gọi hàm cập nhật trạng thái
        await newsService.updateStatus(); // Hàm xử lý cập nhật
        res.send('Update successfully');
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).send('Error updating status');
    }
});
export default router;