import express from 'express';
import tagsService from '../services/tags.service.js';

const router = express.Router();

// Hiển thị danh sách nhãn trong trang admin.hbs
router.get('/', async (req, res) => {
  try {
    const tags = await tagsService.findAll();
    res.render('admin', { tags }); // Gửi dữ liệu nhãn vào trang admin.hbs
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Thêm nhãn mới
router.post('/', async (req, res) => {
  try {
    const newTag = await tagsService.add(req.body);
    res.redirect('/admin/tags'); // Sau khi thêm, chuyển về trang danh sách nhãn
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Sửa nhãn
router.get('/edit/:id', async (req, res) => {
  try {
    const tag = await tagsService.findById(req.params.id);
    res.render('editTag', { tag });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Cập nhật nhãn
router.post('/edit/:id', async (req, res) => {
  try {
    await tagsService.update(req.params.id, req.body);
    res.redirect('/admin/tags');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Xóa nhãn
router.get('/delete/:id', async (req, res) => {
  try {
    await tagsService.delete(req.params.id);
    res.redirect('/admin/tags');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
