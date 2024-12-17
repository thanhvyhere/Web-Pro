import express from 'express';
import categoriesService from '../services/categories.service.js';

const router = express.Router();

// Route: View all categories
router.get('/', async (req, res) => {
    try {
      const categories = await categoriesService.findAll();
      res.render('vwAdministrator/categories/categories', { categories });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching categories');
    }
  });
  
  // Route: Render Add Category Page
  router.get('/add', async (req, res) => {
    try {
      const categories = await categoriesService.findAll(); // Get all categories for dropdown
      res.render('vwAdministrator/categories/add', { categories });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error rendering add category page');
    }
  });
  
  // Route: Add new category
  router.post('/add', async (req, res) => {
    const { CatName, parent_id } = req.body;
    try {
      const newCategory = await categoriesService.add({ CatName, parent_id });
      res.redirect('/categories');  // Redirect to categories list after adding
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding category');
    }
  });
  
// Route: View Category Details
router.get('/detail/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await categoriesService.getCategoryById(categoryId);
        const categories = await categoriesService.getAllCategories();
        res.render('vwAdministrator/categories/detail', { category, categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching category details');
    }
});

// Route: Render Update Category Page
router.get('/update/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await categoriesService.getCategoryById(categoryId);
        const categories = await categoriesService.getAllCategories();
        res.render('vwAdministrator/categories/update', { category, categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rendering update category page');
    }
});

router.post('/update/:id', async (req, res) => {
    const categoryId = req.params.id;
    const { CatName, parent_id } = req.body;
    try {
        await categoriesService.updateCategory(categoryId, CatName, parent_id);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating category');
    }
});

// Route: Render Delete Category Confirmation Page
router.get('/delete/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await categoriesService.getCategoryById(categoryId);
        res.render('vwAdministrator/categories/delete', { category });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rendering delete category page');
    }
});

// Route: Delete Category
router.post('/delete/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        await categoriesService.deleteCategory(categoryId);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting category');
    }
});

export default router;
