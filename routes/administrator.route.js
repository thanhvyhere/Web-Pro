import express from 'express';
import administratorService from '../services/administrator.service.js';
import newsService from '../services/news.service.js';

const router = express.Router();

router.get('/', async function (req,res) {
    const categories = await newsService.getAllCategoriesWithChildren();
    const limitCate = categories.slice(0, 8);
    res.render('homepage', {
        categories: categories,
        limitCate: limitCate
    });
});

// Route: View all tags
router.get('/manage_tags', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
    const limit = 20; // Số mục mỗi trang
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || ''; // Từ khóa tìm kiếm, mặc định rỗng
  
    administratorService.getTagsWithPagination(offset, limit, searchQuery)
      .then(({ tags, total }) => {
        const totalPages = Math.ceil(total / limit);
  
        // Render kết quả
        res.render('vwAdministrator/tags/tags', {
          tags,
          currentPage: page,
          totalPages,
          query: { search: searchQuery },
        });
      })
      .catch(err => {
        console.error('Error fetching tags:', err.message);
        res.status(500).send('Error fetching tags');
      });
  });  

// Route: Render Add Tag Page
router.get('/manage_tags/add', async (req, res) => {
    res.render('vwAdministrator/tags/add');
});

// Route: Add new tag
router.post('/manage_tags/add', async (req, res) => {
    const { TagName } = req.body;
    try {
        await administratorService.addTag({ TagName });
        res.redirect('/administrator/manage_tags');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding tag');
    }
});

// Route: Render Update Tag Page
router.get('/manage_tags/update/:id', async (req, res) => {
    try {
        const tagId = req.params.id;
        const tag = await administratorService.getTagById(tagId);
        res.render('vwAdministrator/tags/update', { tag });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rendering update tag page');
    }
});

// Route: Update Tag
router.post('/manage_tags/update/:id', async (req, res) => {
    try {
        const tagId = req.params.id;
        const updatedTag = req.body;
        await administratorService.updateTag(tagId, updatedTag);
        res.redirect('/administrator/manage_tags');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating tag');
    }
});

// Route: Render Delete Tag Confirmation Page
router.get('/manage_tags/delete/:id', async (req, res) => {
    try {
        const tagId = req.params.id;
        const tag = await administratorService.getTagById(tagId);
        res.render('vwAdministrator/tags/delete', { tag });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rendering delete tag page');
    }
});

// Route: Delete Tag
router.post('/manage_tags/delete/:id', async (req, res) => {
    try {
        const tagId = req.params.id;
        await administratorService.deleteTag(tagId);
        res.redirect('/administrator/manage_tags');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting tag');
    }
});
router.get('/manage_categories', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
    const limit = 20; // Số mục mỗi trang
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || ''; // Từ khóa tìm kiếm, mặc định rỗng
  
    administratorService.findAllWithPagination(offset, limit, searchQuery)
      .then(({ categories, total }) => {
        const totalPages = Math.ceil(total / limit);
  
        if (categories.length === 0) {
          res.render('vwAdministrator/categories/categories', {
            categories: [],
            currentPage: page,
            totalPages,
            query: { search: searchQuery },
            message: searchQuery
              ? `No categories found for search term "${searchQuery}"`
              : 'No categories found', // Thông báo tùy thuộc vào có từ khóa tìm kiếm hay không
          });
        } else {
          res.render('vwAdministrator/categories/categories', {
            categories,
            currentPage: page,
            totalPages,
            query: { search: searchQuery },
          });
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err.message);
        res.status(500).send('Error fetching categories');
      });
  });
  
// Route: Render Add Category Page
router.get('/manage_categories/add', async (req, res) => {
    try {
        const categories = await administratorService.findAll();
        res.render('vwAdministrator/categories/add', { categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rendering add category page');
    }
});
  
// Route: Add new category
router.post('/manage_categories/add', async (req, res) => {
    const { CatName, parent_id } = req.body;
    try {
        await administratorService.add({ CatName, parent_id });
        res.redirect('/administrator/manage_categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding category');
    }
});

// Route cập nhật chuyên mục
router.get('/manage_categories/update/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await administratorService.findById(categoryId);
        res.render('vwAdministrator/categories/update', { category });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rendering update category page');
    }
});

router.post('/manage_categories/update/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updatedCategory = req.body;
        await administratorService.update(categoryId, updatedCategory);
        res.redirect('/administrator/manage_categories');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating category');
    }
});

router.post('/administrator/manage_categories/update_parent', (req, res) => {
    const { categoryIds, newParentId } = req.body;
  
    // Gọi service để thực hiện cập nhật parent_id cho các danh mục
    administratorService.updateCategoryParent(categoryIds, newParentId)
      .then(updatedRows => {
        // Kiểm tra số lượng dòng được cập nhật
        if (updatedRows > 0) {
          res.json({ success: true });
        } else {
          res.json({ success: false, message: 'Không có danh mục nào được cập nhật.' });
        }
      })
      .catch(error => {
        console.error('Error updating categories:', error);
        res.json({ success: false, message: 'Có lỗi xảy ra khi cập nhật danh mục.' });
      });
  });

// Route: Render Delete Category Confirmation Page
router.get('/manage_categories/delete/:id', function(req, res) {
    const categoryId = req.params.id; // Get the category ID from the URL
    administratorService.findCategoryById(categoryId) // Fetch category by ID
      .then(function(category) {
        // Render the delete confirmation page and pass the category data to the view
        res.render('vwAdministrator/categories/delete', { category: category });
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error rendering delete category page');
      });
  });
  

// Route to delete a category
router.post('/manage_categories/delete/:id', function(req, res) {
    const categoryId = req.params.id;
    administratorService.deleteCategories([categoryId])
      .then(function() {
        res.redirect('/administrator/manage_categories'); // Redirect back to the categories list
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error deleting category');
      });
  });  

// manage_users
// Route: View all users with pagination
router.get('/manage_users', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
    const limit = 20; // Số mục mỗi trang
    const offset = (page - 1) * limit;
  
    administratorService.findAllWithPaginationUsers(offset, limit)
      .then(({ users, total }) => {
        const totalPages = Math.ceil(total / limit);
  
        // Render trang với dữ liệu người dùng và phân trang
        res.render('vwAdministrator/users/users', {
          users,
          currentPage: page,
          totalPages,
        });
      })
  });
  
// Route: Render Add User Page
router.get('/manage_users/add', async (req, res) => {
    try {
        const roles = await administratorService.getRoles();  // Ensure roles are fetched
        res.render('vwAdministrator/users/add', { roles });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching roles');
    }
});

// Route: Add new user
router.post('/manage_users/add', async (req, res) => {
    const { username, password, name, email, dob, permission } = req.body;
    try {
        await administratorService.addUsers({ username, password, name, email, dob, permission });
        res.redirect('/administrator/manage_users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding user');
    }
});

// Route: Render Update User Page
router.get('/manage_users/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await administratorService.findByIdUsers(userId);
        const roles = await administratorService.getRoles();  // Ensure roles are fetched
        res.render('vwAdministrator/users/update', { user, roles });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rendering update user page');
    }
});

// Route: Update User
router.post('/manage_users/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = req.body;
        await administratorService.updateUsers(userId, updatedUser);
        res.redirect('/administrator/manage_users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user');
    }
});

// Route: Render Delete User Confirmation Page
router.get('/manage_users/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await administratorService.findByIdUsers(userId);
        res.render('vwAdministrator/users/delete', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rendering delete user page');
    }
});

// Route: Delete User
router.post('/manage_users/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await administratorService.deleteUsers(userId);
        res.redirect('/administrator/manage_users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
});

// Route to get the details of a user
router.get('/manage_users/detail/:id', async (req, res) => {
    const userId = req.params.id;
    console.log('Accessing user details for ID:', userId);  // Log the user ID
    
    try {
        const user = await administratorService.findByIdUsers(userId);
        
        if (user) {
            console.log('User found:', user);  // Log the user data
            res.render('vwAdministrator/users/detail', { user });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving user data');
    }
});

// Route: View all articles with pagination
router.get('/manage_articles', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = 20; // Number of items per page
    const offset = (page - 1) * limit;
  
    administratorService.findAllWithPaginationArticles(offset, limit)
        .then(({ articles, total }) => {
        const totalPages = Math.ceil(total / limit);

        // Render the articles view with data and pagination
        res.render('vwAdministrator/articles/articles', {
            articles,
            currentPage: page,
            totalPages,
        });
        })
        .catch((err) => {
        console.error(err);
        res.status(500).send('Error fetching articles');
        });
    });

// Xem chi tiết bài viết
router.get('/manage_articles/detail/:id', (req, res) => {
    const newsID = req.params.id;
  
    administratorService.findByIdArticles(newsID)  // Gọi service để lấy thông tin bài viết
      .then((article) => {  
        // Render view và truyền dữ liệu bài viết
        res.render('vwAdministrator/articles/detail', { article });
      })
  });
  
  router.get('/manage_articles/update/:id', async (req, res) => {
    const newsID = req.params.id;
    const article = await administratorService.findByIdArticles(newsID);
    if (!article) {
      return res.status(404).send('Article not found');
    }
    res.render('vwAdministrator/articles/update', { article });
  });
  
  // Cập nhật trạng thái Premium
  router.post('/manage_articles/update/:id', (req, res) => {
    const newsId = req.params.id;
    const premiumStatus = req.body.premiumStatus; // Lấy giá trị từ form
    // Chuyển đổi giá trị từ chuỗi 'true' / 'false' sang boolean
    const isPremium = premiumStatus === 'true';  
    administratorService.updatePremium(newsId, isPremium) // Gọi service để cập nhật
      .then(() => {
        res.redirect('/administrator/manage_articles'); // Quay lại trang quản lý bài viết
      })
  });
export default router;