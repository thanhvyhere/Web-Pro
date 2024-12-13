import express from 'express';
//import editorService from '../services/editor.service.js';
const router = express.Router();
router.get('/storage', async function (req,res) 
{
    //await dung de móc được promise và dùng kèm với async
    //const list = await editorService.findAll();
    res.render('vwEditor/storage', 
        {layout: `role`});
});
export default router;