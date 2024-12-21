import db from '../utils/db.js';

export default
{
    findPageById(limit, offset, userId) {
        return db('news')
        .join('categories', 'news.CatID', '=', 'categories.CatID') // Join với bảng categories
        .leftJoin('savednews', function () {
            this.on('news.NewsID', '=', 'savednews.NewsID')
                .andOn('savednews.UserID', '=', db.raw('?', [userId])); // Left join với bảng savednews và so sánh UserID
        })
        .where('news.Premium', '1') // Lọc bài báo có Premium = 1
        .orderBy('news.Views', 'desc') // Sắp xếp theo lượt xem giảm dần
        .select('news.*', 'categories.CatName', db.raw(`
            CASE 
                WHEN savednews.NewsID IS NOT NULL AND savednews.UserID IS NOT NULL THEN TRUE 
                ELSE FALSE 
            END as isSaved
        `)) // Thêm cột isSaved, nếu cả NewsID và UserID khớp thì là TRUE, ngược lại là FALSE
        .limit(limit) // Giới hạn số lượng bài báo
        .offset(offset); // Dùng offset để phân trang
    },    
    findRandById(limit,offset, userid){
        return db('news')
        .join('categories', 'news.CatID', '=', 'categories.CatID') // Join với bảng categories
        .leftJoin('savednews', function () {
            this.on('news.NewsID', '=', 'savednews.NewsID')
                .andOn('savednews.UserID', '=', db.raw('?', [userid])); // Left join với bảng savednews và so sánh UserID
        })
        .orderByRaw('RAND()') // Sắp xếp theo lượt xem giảm dần
        .select('news.*', 'categories.CatName', db.raw(`
            CASE 
                WHEN savednews.NewsID IS NOT NULL AND savednews.UserID IS NOT NULL THEN TRUE 
                ELSE FALSE 
            END as isSaved
        `)) // Thêm cột isSaved, nếu cả NewsID và UserID khớp thì là TRUE, ngược lại là FALSE
        .limit(limit) // Giới hạn số lượng bài báo
        .offset(offset); // Dùng offset để phân trang
    },
    findSavedPreNewsById(userId) {
        return db('news')
            .join('categories', 'news.CatID', '=', 'categories.CatID') // Kết hợp với bảng categories
            .leftJoin('savednews', function () {
                this.on('news.NewsID', '=', 'savednews.NewsID')
                    .andOn('savednews.UserID', '=', userId); // So sánh trực tiếp với UserID
            })
            .where('news.Premium', '1') // Chỉ lấy bài viết Premium
            .orderBy('news.Views', 'desc') // Sắp xếp theo lượt xem giảm dần
            .select('news.*', 'categories.CatName', db.raw('IF(savednews.UserID IS NOT NULL, 1, 0) as isSaved')); // Đánh dấu bài báo đã được lưu
    },
    savedNews(userId,articleId)
    {
        return db('savednews')
        .where({ UserID: userId, NewsID: articleId })
        .first();
    },
    saveSaved(NewsID, id)
    {
        return db('savednews').insert({
            UserID: id,
            NewsID: NewsID,
            CreatedDate: new Date(),
        });
    },
    delSaved(NewsID, id)
    {
        return db('savednews')
        .where({UserID: id,
            NewsID: NewsID,})
        .del()
    },
    findNews(NewsID)
    {
        return db('news').where('NewsID', NewsID).first()
    },
    savedNewsByUserID(userId) {
        return db('news')
            .join('categories', 'news.CatID', '=', 'categories.CatID') // Kết hợp với bảng categories
            .join('savednews', 'news.NewsID', '=', 'savednews.NewsID') // Chỉ kết hợp với các bài đã lưu
            .where('savednews.UserID', userId) // Chỉ lấy bài viết của UserID đã lưu
            .select('news.*', 'categories.CatName') // Chọn các cột cần thiết
            .orderBy('news.Views', 'desc'); // Sắp xếp theo lượt xem giảm dần
    }
}