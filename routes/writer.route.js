
import express from 'express';
//import accountService from '../services/writer.service'

const router = express.Router();
router.get('/write', function (req, res) { // hàm comeback, khi điều kiện thỏa thì chạy
    res.render('vwWriter/write');
});

export default router;