import express from 'express';

const router = express.Router();

// Tính viết đại á, hem biết nó có tác dụng gì hem nữa, xóa đi cũng được.
router.get('/login', function(req,res){
    res.render('account/login');
});


export default router;