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
router.get('/manage_tags', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    try {
        const { tags, total } = await administratorService.getTagsWithPagination(offset, limit);
        const totalPages = Math.ceil(total / limit);

        res.render('vwAdministrator/tags/tags', {
            tags,
            currentPage: page,
            totalPages,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching tags');
    }
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
router.get('/manage_categories', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const limit = 20; // Number of items per page
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || ''; // Lấy từ khóa tìm kiếm, mặc định rỗng
  
    try {
      // Gọi service với offset, limit và searchQuery
      const { categories, total } = await administratorService.findAllWithPagination(offset, limit, searchQuery);
      const totalPages = Math.ceil(total / limit);
  
      // Kiểm tra và render kết quả
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
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).send('Error fetching categories');
    }
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

// Route: Render Delete Category Confirmation Page
router.get('/manage_categories/delete/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await administratorService.findById(categoryId);
        res.render('vwAdministrator/categories/delete', { category });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rendering delete category page');
    }
});

// Route: Delete Category
router.post('/manage_categories/delete/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const result = await administratorService.delete(categoryId);

        if (result > 0) {
            res.redirect('/administrator/manage_categories');
        } else {
            res.status(404).send('Category not found or already deleted');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting category');
    }
});

// manage_users
// Route: View all users with pagination
router.get('/manage_users', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        // Lấy dữ liệu người dùng với tên quyền (permission) từ bảng roles
        const { users, total } = await administratorService.findAllWithPaginationUsers(offset, limit);

        // Tính tổng số trang
        const totalPages = Math.ceil(total / limit);

        // Render trang với dữ liệu người dùng và phân trang
        res.render('vwAdministrator/users/users', {
            users,
            currentPage: page,
            totalPages,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
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

export default router;