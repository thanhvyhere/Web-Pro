import express from 'express';
//import editorService from '../services/editor.service.js';
const router = express.Router();
const role = 'editor';
router.get('/', async function (req,res) 
{
    //await dung de móc được promise và dùng kèm với async
    //const list = await editorService.findAll();
   
    res.render('homepage', 
       
    );
});
router.get('/storage', async function (req,res) 
{
    //await dung de móc được promise và dùng kèm với async
    //const list = await editorService.findAll();
   
    res.render('vwEditor/storage', 
       
    );
});

// repository
router.get('/repository', async function (req,res) 
{
    res.render('vwEditor/storage', 
        );
});
// reviewed
router.get('/reviewed', async function (req,res) 
{
    res.render('vwEditor/storage', 
        );
});
// editor_rejected
router.get('/editor_rejected', async function (req,res) 
{
    res.render('vwEditor/storage', 
        );
});
// editor_approved
router.get('/editor_approved', async function (req,res) 
{
    res.render('vwEditor/storage', 
        );
});
// schedule
router.get('/schedule', async function (req,res) 
{
    res.render('vwEditor/storage', 
        );
});
export default router;