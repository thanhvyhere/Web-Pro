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
  
  async findAllWithPagination(offset, limit) {
    const [categories, [{ total }]] = await Promise.all([
      db('categories').limit(limit).offset(offset),
      db('categories').count('CatID as total')
    ]);
    return { categories, total };
  },

    // tag methods
    async getAllTags() {
        return await db('tag');
    },

    async getTagsWithPagination(offset, limit) {
        const [tags, [{ total }]] = await Promise.all([
        db('tag').limit(limit).offset(offset),
        db('tag').count('TagID as total'),
        ]);
        return { tags, total };
    },

    async getTagById(tagId) {
        return await db('tag').where('TagID', tagId).first();
    },

    async addTag(tag) {
        return await db('tag').insert(tag);
    },

    async updateTag(tagId, updatedTag) {
        return await db('tag').where('TagID', tagId).update(updatedTag);
    },

    async deleteTag(tagId) {
        return await db('tag').where('TagID', tagId).del();
    },

  // Lấy tất cả người dùng
  async findAllUsers() {
    try {
      const users = await db('users');
      return users;
    } catch (error) {
      throw new Error('Error fetching users: ' + error.message);
    }
  },

  // Lấy thông tin người dùng theo ID
  async findByIdUsers(id) {
    try {
      if (!id) throw new Error('User ID is required');
      const user = await db('users').where('id', id).first();
      console.log('User found:', user);  // Log the found user data
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Error fetching user by ID: ' + error.message);
    }
  },

  // Thêm người dùng mới
  async addUsers(user) {
    try {
      if (!user || !user.username || !user.password) {
        throw new Error('Username and password are required');
      }

      const [newUserId] = await db('users')
        .insert({
          username: user.username,
          password: user.password,
          name: user.name || null,
          email: user.email || null,
          dob: user.dob || null,
          permission: user.permission || 0,
        })
        .returning('id'); // Trả về ID của người dùng mới thêm

      return newUserId;
    } catch (error) {
      throw new Error('Error adding new user: ' + error.message);
    }
  },

  // Cập nhật thông tin người dùng
  async updateUsers(id, updatedUser) {
    try {
      if (!id) throw new Error('User ID is required');
      if (!updatedUser) throw new Error('Updated user data is required');

      // Kiểm tra người dùng có tồn tại không
      const existingUser = await db('users').where('id', id).first();
      if (!existingUser) throw new Error('User not found');

      // Cập nhật thông tin
      const updatedRows = await db('users')
        .where('id', id)
        .update({
          username: updatedUser.username,
          password: updatedUser.password,
          name: updatedUser.name || null,
          email: updatedUser.email || null,
          dob: updatedUser.dob || null,
          permission: updatedUser.permission || 0,
        });

      if (updatedRows === 0) throw new Error('No changes made or user not found');
      return updatedRows;
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  },

// Xóa người dùng
async deleteUsers(id) {
  try {
    if (!id) throw new Error('User ID is required');

    // Kiểm tra người dùng có tồn tại không
    const existingUser = await db('users').where('id', id).first();
    if (!existingUser) throw new Error('User not found');

    // Xóa người dùng
    const deletedRows = await db('users').where('id', id).del();
    if (deletedRows === 0) throw new Error('User not found');
    return deletedRows;
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
},

async getRoles() {
  try {
      const roles = await db('roles').select('RoleID', 'RoleName');
      return roles;
  } catch (err) {
      console.error('Error fetching roles:', err);
      throw new Error('Error fetching roles');
  }
},

// Lấy danh sách người dùng có phân trang và tên quyền (permission)
async findAllWithPaginationUsers(offset, limit) {
  try {
    // Thực hiện JOIN giữa bảng 'users' và 'roles' để lấy tên quyền
    const [users, [{ total }]] = await Promise.all([
      db('users')
        .join('roles', 'users.permission', '=', 'roles.RoleID')  // Thay 'users.roleID' bằng 'users.permission'
        .select('users.id', 'users.username', 'users.name', 'users.email', 'roles.RoleName as permission')  // Lấy permission từ RoleName
        .limit(limit)
        .offset(offset),

      db('users').count('id as total'),  // Lấy tổng số người dùng
    ]);

    return { users, total };
  } catch (error) {
    throw new Error('Error fetching users with pagination: ' + error.message);
  }
},

async findAllWithPagination(offset, limit, searchQuery = '') {
  try {
    console.log('Fetching categories with offset:', offset, 'limit:', limit, 'searchQuery:', searchQuery); // Logging

    // Áp dụng điều kiện tìm kiếm nếu searchQuery không rỗng
    const query = db('categories');
    if (searchQuery) {
      query.where('CatName', 'like', `%${searchQuery}%`);
    }

    const [categories, [{ total }]] = await Promise.all([
      query.clone().limit(limit).offset(offset), // Áp dụng phân trang
      query.clone().count('CatID as total'),     // Tính tổng số bản ghi theo điều kiện tìm kiếm
    ]);

    console.log('Categories fetched:', categories);  // Log fetched categories
    console.log('Total categories:', total);         // Log total count

    return { categories, total };
  } catch (error) {
    console.error('Error in findAllWithPagination:', error);  // Log error if any
    throw new Error('Error fetching categories with pagination: ' + error.message);
  }
}


};
