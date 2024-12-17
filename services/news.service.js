import db from '../utils/db.js';
export default
{
    findAll() {
        return db('news');
    },

    findById(id) {
        return db('news').where('ProID', id).first();
    },

    add(entity) { // entity: {co truong CatName de add vao bang}
        return db('news').insert(entity);
    },

    del(id) {
        return db('news').where('ProID', id).del();
    },

    patch(id, entity) {
        return db('news').where('ProID', id).update(entity);
    },

    findByCatId(catId) {
        return db('news').where('CatID', catId);
    },

    findPageByCatId(catId, limit, offset){
        return db('news').where('CatID', catId).limit(limit).offset(offset);
    },
    countByCatId(catId){
        return db('news').where('CatID', catId).count('* as total').first();
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
            .where('AuthorName', authorName)
            .andWhere('Status', status)
    },

    findCatByCatId(catId) {
        return ('categories').where('CatID', catId).first();
    },


}