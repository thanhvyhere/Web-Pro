import express from 'express';
import newsService from '../services/news.service.js';
import editorService from '../services/editor.service.js';
import fs from 'fs'
import multer from 'multer'
import path from 'path'

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
    
    // Sửa lại từ 'new' thành 'allNews'
    const updatedList = await Promise.all(allNews.map(async (news) => {
        const category = await newsService.findCatByCatId(news.CatID);  // Sử dụng 'news' thay vì 'new'
        return {
            ...news, // Giữ nguyên tất cả các thuộc tính của allNews
            catName: category ? category.CatName : 'Chưa có danh mục', // Thêm catName vào đối tượng
        };
    }));

    // Pagination calculation
    const totalNews = allNews.length;
    const nPages = Math.ceil(totalNews / limit);
    const pageNumbers = Array.from({ length: nPages }, (_, i) => ({
        value: i + 1,
        active: i + 1 === current_page
    }));

    // Render the view
    res.render(viewName, {
        newsList: updatedList,
        empty: newsWithCategories.length === 0,
        pageNumbers,
        current_page
    });
}

// Homepage route
router.get('/', async function (req,res) {
    res.render('homepage', {
    });
});
// Create article routes
router.get('/create_article', async (req, res) => {
    const categories = await newsService.getAllCategories();
    res.render('vwWriter/create', { categories });
});
const upload = multer({ dest: './static/imgs/news/' })
router.post('/create_article',upload.single('ImageFile'), async (req, res) => {
        const imagePath = './static/imgs/news/';
        const imageFile = req.file; // Lấy file upload từ multer
        const imageUrl = req.body.ImageUrl ? req.body.ImageUrl.trim() : ''; // Lấy URL từ form
        const number = await newsService.countByNews();
        console.log(number)
        // Kiểm tra nếu cả file và URL đều được gửi
        if (imageFile && imageUrl) {
            return res.status(400).send('Only one input (file or URL) is allowed');
        }

        // Mảng chứa các ảnh cuối cùng
        let finalImages = [];

        // Nếu file được tải lên
        if (imageFile) {
            const fileName = `news_${number.total}.jpg`;
            const newFilePath = path.join(imagePath, fileName);

            // Đổi tên file để lưu đúng chuẩn
            fs.renameSync(imageFile.path, newFilePath);

            // Thêm đường dẫn vào mảng
            finalImages.push(`/static/imgs/news/${fileName}`);
        } 
        // Nếu URL được cung cấp
        else if (imageUrl) {
            if (imageUrl.startsWith('http')) {
                finalImages.push(imageUrl);
            } else {
                return res.status(400).send('Invalid URL');
            }
        } else {
            return res.status(400).send('No image provided');
        }

        console.log('Final Images:', finalImages);

        // Lấy ảnh đầu tiên làm ảnh bìa
        const coverImage = finalImages[0];

    const { title, author, abstract, content, is_premium, category_child_id, CatID } = req.body;
    const entity = {
        Title: title,
        AuthorName: req.session.authUser.name,
        Abstract: abstract,
        CatID: category_child_id,
        Content: content,
        Premium: 0,
        CreatedDate: new Date(),
        Status: 2,
        ImageCover: coverImage 
    };

    try {
        await newsService.add(entity);
        const [result] = await newsService.getIdNewEntity();
        const newsID = result[0].id;
        const { tags } = req.body  || "";
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
                    NewsID: newsID
                };

                await newsService.addTagIdAndNewsId(tagNewsEntity);
            }
            res.redirect('/writer/pending_approval?success=Upload%20successful!');
        }
        

        // Chuyển hướng với thông báo thành công
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save tags' });
    }
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
router.get('/pending_approval', (req, res) => renderNewsByStatus(req, res, 2, 'vwWriter/pending_approval'));

export default router;
