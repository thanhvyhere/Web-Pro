import db from '../utils/db.js';

export default {
  // Lấy tất cả chuyên mục
  async findAll() {
    try {
      const categories = await db('categories');
      return categories;
    } catch (error) {
      throw new Error('Error fetching categories: ' + error.message);
    }
  },

  // Lấy một chuyên mục theo ID
  async findById(id) {
    try {
      if (!id) throw new Error('Category ID is required');
      const category = await db('categories').where('CatID', id).first();
      if (!category) throw new Error('Category not found');
      return category;
    } catch (error) {
      throw new Error('Error fetching category by ID: ' + error.message);
    }
  },

  // Thêm chuyên mục mới
  async add(category) {
    try {
      // Kiểm tra đầu vào
      if (!category || !category.CatName) throw new Error('Category name is required');
      
      // Nếu có parent_id, kiểm tra xem có tồn tại danh mục cha không
      if (category.parent_id) {
        const parentCategory = await db('categories').where('CatID', category.parent_id).first();
        if (!parentCategory) throw new Error('Parent category not found');
      }

      // Thêm chuyên mục mới vào bảng
      const [newCategory] = await db('categories').insert({
        CatName: category.CatName,
        parent_id: category.parent_id || null,  // Nếu không có parent_id thì gán giá trị null
      }).returning('CatID');
      
      return newCategory;  // Trả về CatID của chuyên mục vừa thêm
    } catch (error) {
      throw new Error('Error adding new category: ' + error.message);
    }
  },

  // Cập nhật chuyên mục
  async update(id, category) {
    try {
      if (!id) throw new Error('Category ID is required');
      if (!category || !category.CatName) throw new Error('Category name is required');
      
      // Kiểm tra xem chuyên mục có tồn tại không
      const existingCategory = await db('categories').where('CatID', id).first();
      if (!existingCategory) throw new Error('Category not found');
      
      // Nếu có parent_id, kiểm tra xem có tồn tại danh mục cha không
      if (category.parent_id) {
        const parentCategory = await db('categories').where('CatID', category.parent_id).first();
        if (!parentCategory) throw new Error('Parent category not found');
      }

      // Cập nhật chuyên mục
      const updatedRows = await db('categories')
        .where('CatID', id)
        .update({
          CatName: category.CatName,
          parent_id: category.parent_id || null, // Cho phép cập nhật parent_id có thể null
        });

      if (updatedRows === 0) throw new Error('No changes made or category not found');
      return updatedRows;
    } catch (error) {
      throw new Error('Error updating category: ' + error.message);
    }
  },

  // Xoá chuyên mục
  async delete(id) {
    try {
      if (!id) throw new Error('Category ID is required');
      
      // Kiểm tra xem chuyên mục có tồn tại không
      const existingCategory = await db('categories').where('CatID', id).first();
      if (!existingCategory) throw new Error('Category not found');

      // Xoá chuyên mục
      const deletedRows = await db('categories').where('CatID', id).del();
      if (deletedRows === 0) throw new Error('Category not found');
      return deletedRows;
    } catch (error) {
      throw new Error('Error deleting category: ' + error.message);
    }
  },
};
