import db from '../utils/db.js';
export default
{
    // findAll() {
    //     return db('articles')
    //         .select('articles.*', 'categories.category_name')
    //         .leftJoin('categories', 'articles.category_id', 'categories.id');
    // },

    // findActicaleById(id) {
    //     return db('articles')
    //         .where('id', id)
    //         .first();
    // },
    // findCategoryByid(id) {
    //     return db('categories')
    //         .where('id', id)
    //         .first
    // },    
    // add(entity) { // entity: {co truong CatName de add vao bang}
    //     return db('articles').insert(entity);
    // },
    getAllCategories() {
        return db('categories').where('parent_id', null);
    },
    getCategoriesChild(catId) {
        return db('categories').where('parent_id', catId);
    }
}