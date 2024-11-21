import express from 'express';

const router = express.Router();

router.get('/login', function(req,res){
    res.render('account/login');
});


export default router;