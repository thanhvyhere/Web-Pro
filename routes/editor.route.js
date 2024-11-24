import express from 'express';
import editorService from '../service/editor.service.js';
const router = express.Router();
router.get('/newsstorage', async function (req,res) 
{
    //await dung de móc được promise và dùng kèm với async
    //const list = await editorService.findAll();
    res.render('vwEditor/storage', 
        // {
        //    list:list
        // }, 
        {layout: `role`});
});
export default router;