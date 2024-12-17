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
    }
}
