import db from '../utils/db.js';
export default
    {
        findAll() {
            return db('news');
        },

        findById(id) {
            return db('news').where('NewsID', id).first();
        },

        add(entity) { // entity: {co truong CatName de add vao bang}
            return db('news').insert(entity);
        },

        del(id) {
            return db('news').where('NewsID', id).del();
        },

        patch(id, entity) {
            return db('news').where('NewsID', id).update(entity);
        },

        findByCatId(catId) {
            return db('news').where('CatID', catId);
        },

        findPageByCatId(catId, limit, offset) {
            return db('news')
                .where({ 'CatID': catId, 'Status': 3 }).limit(limit).offset(offset);
        },
        countByCatId(catId) {
            return db('news').where({ 'CatID': catId, 'Status': 3 }).count('* as total').first();
        },
        getAllCategories() {
            return db('categories').where('parent_id', null);
        },
        getCategoriesChild(catId) {
            return db('categories').where('parent_id', catId);
        },
    
        getAllCategoriesLimit() {
            return db('categories')
                .select('*') // Chọn tất cả các cột
                .where('parent_id', null) // Điều kiện parent_id = null
                .limit(8); // Giới hạn 8 bản ghi
        },
    
        async getAllCategoriesWithChildren() {
            const categories = await db('categories').where('parent_id', null);

            for (let category of categories) {
                category.children = await db('categories').where('parent_id', category.CatID);
            }
            return categories;
        },
        getNewsByAuthorStatus(authorName, status) {
            return db('news')
                .where({
                    AuthorName: authorName,
                    Status: status
                });
        },


        findCatByCatId(catId) {
            return db('categories').where('CatID', catId).first();
        },

        getAllTags() {
            return db('tag').select('TagName'); // Chỉ lấy cột TagName
        },


        findTagByTagName(tagname) {
            return db('tag').where('TagName', tagname).first();
        },

        addNewTag(newTag) {
            return db('tag').insert(newTag);
        },
        addTagIdAndNewsId(entity) {
            return db('news_tags').insert(entity);
        },
        delTagByNewsId(newId) {
            return db('news_tags').where('NewsID', newId).del();
        },
        getIdNewEntity() {
            return db.raw('SELECT LAST_INSERT_ID() as id');
        },

        getTagByNewsId(newId) {
            return db('tag as t')
                .join('news_tags as nt', 't.TagID', '=', 'nt.TagID')
                .where('nt.NewsID', newId)
                .select('t.TagName'); // Chỉ chọn cột TagName từ bảng tag
        },

        getAllCommentById(id) {
            return db('comment')
                .join('users', 'comment.UserID', '=', 'users.id') // Hợp bảng comment với users qua UserID
                .select('comment.*', 'users.username') // Chọn tất cả từ comment và thêm username từ users
                .where('comment.NewsID', id) // Điều kiện lọc theo NewsID
                .orderBy('comment.CreatedDate', 'desc'); // Sắp xếp theo ngày (CreatedDate) giảm dần
        },



        addComment(entity) {
            return db('comment').insert(entity);
        },
        countCommentBynewsId(newId) {
            return db('comment').where('NewsID', newId).count('* as total').first();
        },
    
        incrementViewCount(newsId) {
            // Tăng cột view lên 1
            return db('news')
                .where('NewsID', newsId)  // Điều kiện lọc theo NewsID
                .increment('Views', 1); // Tăng giá trị cột 'view' lên 1
        },

        getTop3NewsByView() {
             return db('news')
                .join('categories', 'news.CatID', '=', 'categories.CatID') 
                .orderBy('news.Views', 'desc')  
                .limit(3);  

        }
    }
