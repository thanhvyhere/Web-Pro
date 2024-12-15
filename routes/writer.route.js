import express from 'express';
//import accountService from '../services/writer.service'

const router = express.Router();
router.get('/', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('homepage', 
       );
});

// create_article
router.get('/create_article', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/write', 
       );
});

// approved
router.get('/approved', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/approved', 
       );
});

// published
router.get('/published', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/published', 
       );
});
// rejected
router.get('/rejected', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/rejected', 
       );
});
// pending_approval
router.get('/pending_approval', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/pending_approval', 
       );
});
export default router;