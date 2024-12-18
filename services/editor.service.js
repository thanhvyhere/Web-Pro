import db from '../utils/db.js'

export default
{
    findAll()
    {
        return db('news')
        .join('status', 'news.Status', '=', 'status.StatusID')
        .orderByRaw(`
            FIELD(status.StatusName, 'Đang chờ', 'Đã chỉnh sửa', 'Đã duyệt', 'Đã nhận xét', 'Đã từ chối', 'Đã đăng', 'Đã xóa')
        `)
        .select('news.*', 'status.StatusName');
    },
    findReviewed()
    {
        return db('news')
        .join('status', 'news.Status', '=', 'status.StatusID')
        .where('status.StatusName', 'Đã nhận xét')
        .select('news.*', 'status.StatusName');
    },
    findRejected()
    {
        return db('news')
        .join('status', 'news.Status', '=', 'status.StatusID')
        .where('status.StatusName', 'Đã từ chối')
        .select('news.*', 'status.StatusName');
    },
    findApproved()
    {
        return db('news')
        .join('categories as child', 'news.CatID', '=', 'child.CatID') // Join danh mục con
        .leftJoin('categories as parent', 'child.parent_id', '=', 'parent.CatID') // Join danh mục cha
        .join('status', 'news.Status', '=', 'status.StatusID') // Join trạng thái
        .leftJoin('news_tags', 'news.NewsID', '=', 'news_tags.NewsID') // Join bảng news_tags
        .leftJoin('tag', 'news_tags.TagID', '=', 'tag.TagID') // Join bảng tag
        .where('status.StatusName', 'Đã duyệt') // Chỉ lấy bài báo có trạng thái 'Đã duyệt'
        .select(
            'news.*', // Lấy tất cả các cột từ bảng news
            'child.CatName as ChildCatName', // Tên danh mục con
            'parent.CatName as ParentCatName', // Tên danh mục cha
            'child.CatID as ChildCatID', // ID danh mục con
            'parent.CatID as ParentCatID', // ID danh mục cha
            'status.StatusName as StatusName', // Tên trạng thái
            db.raw('COALESCE(GROUP_CONCAT(tag.TagName SEPARATOR ", "), "không có") as Tags') // Gộp tất cả các thẻ vào chuỗi
        )
        .groupBy(
            'news.NewsID', // Nhóm theo NewsID để tránh duplicate rows
            'child.CatName',
            'parent.CatName',
            'child.CatID',
            'parent.CatID',
            'status.StatusName' // Thêm các cột không aggregate vào groupBy
        )
        .then(results => {
            // Thêm cột "No" để đánh số thứ tự cho từng dòng kết quả
            return results.map((item, index) => {
                item.No = index + 1; // Đánh số thứ tự bắt đầu từ 1
                return item;
            });
        });

    },
    findParentCat()
    {
        return db('categories').where('parent_id',null);
    },
    findChildCat(parentID)
    {
        return db('categories').where('parent_id', parentID);
    },
    update(entity, id) {
        return db('news').where('NewsID', id).update(entity);
    },
    findANews(id)
    {
        return db('news').join('categories as child', 'news.CatID', '=', 'child.CatID') // Join danh mục con
        .leftJoin('categories as parent', 'child.parent_id', '=', 'parent.CatID') // Join danh mục cha
        .join('status', 'news.Status', '=', 'status.StatusID') // Join bảng trạng thái
        .leftJoin('news_tags', 'news.NewsID', '=', 'news_tags.NewsID') // Join bảng news_tags
        .leftJoin('tag', 'news_tags.TagID', '=', 'tag.TagID') // Join bảng tag
        .where('status.StatusName', 'Đã duyệt') // Chỉ lấy bài báo có trạng thái 'Đã duyệt'
        .where('news.NewsID', id) // Chỉ lấy bài báo với NewsID tương ứng với 'id'
        .select(
            'news.*',
            'child.CatName as ChildCatName',
            'parent.CatName as ParentCatName',
            'child.CatID as ChildCatID',
            'parent.CatID as ParentCatID',
            'status.StatusName as StatusName',
            db.raw('GROUP_CONCAT(tag.TagName) as Tags') // Gộp tất cả các thẻ thành một chuỗi
        )
        .groupBy('news.NewsID') // Gộp theo NewsID để tránh trùng lặp kết quả
        .then(results => {
            return results;
        });
    }
}