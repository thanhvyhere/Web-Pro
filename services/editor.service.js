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
        .join('categories as child', 'news.CatID', '=', 'child.CatID') // Join bảng categories với alias "child" để lấy thông tin danh mục con
        .leftJoin('categories as parent', 'child.parent_id', '=', 'parent.CatID') // Join bảng categories với alias "parent" để lấy thông tin danh mục cha
        .join('status', 'news.Status', '=', 'status.StatusID') // Join bảng status để lấy tên trạng thái
        .where('status.StatusName', 'Đã duyệt') // Lọc chỉ lấy những bài viết có trạng thái 'Đã duyệt'
        .select('news.*', 'child.CatName as ChildCatName', 'parent.CatName as ParentCatName', 'child.CatID as ChildCatID', 'parent.CatID as ParentCatID', 'status.StatusName as StatusName') // Lấy thông tin của các bảng
        .then(results => {
            // Thêm cột "No" đánh số thứ tự cho từng dòng kết quả
            return results.map((item, index) => {
                item.No = index + 1; // Đánh số thứ tự từ 1
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
        return db('news').where('NewsID', id);
    }
}