import db from '../utils/db.js';

export default {
  // Lấy tất cả chuyên mục
  findAll() {
    return db('categories');
  },

  // Lấy một chuyên mục theo ID
  findBfindCategoryByIdyId(categoryId) {
    return db('categories').where('CatID', categoryId).first();
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

// Hàm cập nhật parent_id cho các danh mục
updateCategoryParent(categoryIds, newParentId) {
  // Kiểm tra nếu newParentId là null, không cho phép cập nhật thành null
  if (newParentId === null) {
    return Promise.reject(new Error('Không thể cập nhật parent_id thành null.'));
  }

  // Kiểm tra xem parent_id có tồn tại trong cơ sở dữ liệu không
  return db('categories')
    .where('CatID', newParentId)  // Kiểm tra xem parent_id mới có tồn tại không
    .first()
    .then(parentCategory => {
      if (!parentCategory) {
        return Promise.reject(new Error('Danh mục cha không tồn tại.'));
      }

      // Cập nhật parent_id cho các danh mục
      return db('categories')
        .whereIn('CatID', categoryIds)  // Cập nhật tất cả các danh mục có trong categoryIds
        .update({ parent_id: newParentId || null })  // Cập nhật parent_id
        .then(updatedRows => {
          return updatedRows;  // Trả về số lượng dòng được cập nhật
        });
    })
    .catch(error => {
      throw new Error('Có lỗi khi cập nhật danh mục: ' + error.message);
    });
},

// Delete selected categories
deleteCategories(categoryIds) {
  return db('categories')
    .whereIn('CatID', categoryIds)
    .del();
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
  return db('users')
    .insert({
      username: user.username,
      password: user.password,
      name: user.name || null,
      email: user.email || null,
      dob: user.dob || null,
      permission: user.permission || 0,
    })
    .returning('id')
    .then((result) => {
      const [newUserId] = result;  // Destructure the array returned
      return newUserId;  // Return the ID of the newly inserted user
    })
    .catch((error) => {
      console.error(error);
      throw error;  // Rethrow the error for further handling if necessary
    });
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
  },

  findAllWithPaginationArticles(offset, limit) {
    return db('news')
      .select(
        'NewsID',
        'CreatedDate',
        'Title',
        'AuthorName',
        'Status',
        'Views',
        'Premium'
      )
      .offset(offset)
      .limit(limit)
      .then((articles) => {
        return db('news')
          .count('NewsID as total')
          .first()
          .then(({ total }) => ({ articles, total }));
      });
  },
  // Lấy thông tin chi tiết bài viết
  findByIdArticles(newsID) {
    return db('news')
      .select(
        'news.NewsID',
        'news.CreatedDate',
        'news.Title',
        'news.Content',
        'news.Abstract',
        'news.CatID',
        'news.AuthorName',
        'news.ImageCover',
        'news.Status',
        'news.PublishedDay',
        'news.Feedback',
        'news.Views',
        'news.Premium',
        'status.StatusName'  // Lấy tên trạng thái từ bảng status
      )
      .leftJoin('status', 'news.Status', 'status.StatusID')
      .where('news.NewsID', newsID)
      .first()
      .then((article) => {
        return article;
      });
  },  

  // Cập nhật trạng thái Premium của bài viết
  updatePremium(newsId, premium) {
    const isPremium = premium === true || premium === 'true'; // Chuyển đổi sang boolean  
    return db('news')
      .where('NewsID', newsId)
      .update({ Premium: isPremium })
  },
};
