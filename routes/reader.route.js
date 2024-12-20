import express from 'express';
import newsService from '../services/news.service.js';
import editorService from '../services/editor.service.js';
import fs from 'fs'
import multer from 'multer'
import path from 'path'

const router = express.Router();


// Homepage route
router.get('/', async function (req,res) {
    const categories = await newsService.getAllCategoriesWithChildren();
    res.render('homepage', {
        categories: categories,
        limitCate: categories.slice(0, 8)
    });
});

export default router;
