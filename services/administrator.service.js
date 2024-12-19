import db from '../utils/db.js';

export default {
  // Lấy tất cả chuyên mục
  findAll() {
    return db('categories');
  },

  // Lấy một chuyên mục theo ID
  findById(id) {
    return db('categories').where('CatID', id).first();
  },

  // Thêm chuyên mục mới
  add(category) {
    const [newCategory] = db('categories').insert({
      CatName: category.CatName,
      parent_id: category.parent_id || null,
    }).returning('CatID');
    return newCategory;
  },

  // Cập nhật chuyên mục
  update(id, category) {
    const updatedRows = db('categories')
      .where('CatID', id)
      .update({
        CatName: category.CatName,
        parent_id: category.parent_id || null,
      });
    return updatedRows;
  },

  // Xoá chuyên mục
  delete(id) {
    return db('categories').where('CatID', id).del();
  },

  // Tags methods
  getAllTags() {
    return db('tag');
  },

  getTagsWithPagination(offset, limit, searchQuery = '') {
    const query = db('tag');
  
    if (searchQuery) {
      query.where('TagName', 'like', `%${searchQuery}%`);
    }
  
    return Promise.all([
      query.clone().limit(limit).offset(offset), // Lấy danh sách tags
      query.clone().count('TagID as total'),    // Đếm tổng số tags
    ])
      .then(([tags, countResult]) => {
        const total = countResult[0]?.total || 0; // Xử lý kết quả đếm
        return { tags, total };
      })
  },
  

  getTagById(tagId) {
    return db('tag').where('TagID', tagId).first();
  },

  addTag(tag) {
    return db('tag').insert(tag);
  },

  updateTag(tagId, updatedTag) {
    return db('tag').where('TagID', tagId).update(updatedTag);
  },

  deleteTag(tagId) {
    return db('tag').where('TagID', tagId).del();
  },

  // Lấy tất cả người dùng
  findAllUsers() {
    return db('users');
  },

  // Lấy thông tin người dùng theo ID
  findByIdUsers(id) {
    return db('users').where('id', id).first();
  },

  // Thêm người dùng mới
  addUsers(user) {
    const [newUserId] = db('users')
      .insert({
        username: user.username,
        password: user.password,
        name: user.name || null,
        email: user.email || null,
        dob: user.dob || null,
        permission: user.permission || 0,
      })
      .returning('id');
    return newUserId;
  },

  // Cập nhật thông tin người dùng
  updateUsers(id, updatedUser) {
    const updatedRows = db('users')
      .where('id', id)
      .update({
        username: updatedUser.username,
        password: updatedUser.password,
        name: updatedUser.name || null,
        email: updatedUser.email || null,
        dob: updatedUser.dob || null,
        permission: updatedUser.permission || 0,
      });
    return updatedRows;
  },

  // Xóa người dùng
  deleteUsers(id) {
    return db('users').where('id', id).del();
  },

  // Lấy danh sách quyền
  getRoles() {
    return db('roles').select('RoleID', 'RoleName');
  },

  // Lấy danh sách người dùng có phân trang và tên quyền (permission)
  findAllWithPaginationUsers(offset, limit) {
    return Promise.all([
      db('users')
        .join('roles', 'users.permission', '=', 'roles.RoleID')
        .select(
          'users.id',
          'users.username',
          'users.name',
          'users.email',
          'users.dob', // Thêm ngày sinh vào kết quả
          'users.NoOfFollower', // Thêm số người theo dõi
          'users.NoOfFollowing', // Thêm số người đang theo dõi
          'roles.RoleName as permission'
        )
        .limit(limit)
        .offset(offset), // Lấy danh sách người dùng
      db('users').count('id as total'), // Đếm tổng số người dùng
    ])
    .then(([users, countResult]) => {
      const total = countResult[0]?.total || 0; // Xử lý kết quả đếm
      return { users, total };
    })
  },
   

  // Lấy danh sách chuyên mục với phân trang và tìm kiếm
  findAllWithPagination(offset, limit, searchQuery = '') {
    const query = db('categories');
  
    if (searchQuery) {
      query.where('CatName', 'like', `%${searchQuery}%`);
    }
  
    return Promise.all([
      query.clone().limit(limit).offset(offset), // Lấy danh sách categories
      query.clone().count('CatID as total'),    // Đếm tổng số categories
    ])
      .then(([categories, countResult]) => {
        const total = countResult[0]?.total || 0;
        return { categories, total };
      })
  }
};
