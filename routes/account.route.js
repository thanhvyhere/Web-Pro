import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment'; // format month day
import multer from 'multer';
import accountService from '../services/account.service.js';
import auth from '../middleware/auth.mdw.js';
import configurePassportGithub from '../controllers/passportGithub.config.js';
import configurePassportGoogle from '../controllers/passportGoogle.config.js';

import passport from 'passport';

const router = express.Router();

router.get('/login', function (req, res) {
    res.render('vwAccount/login', {
        layout: 'account-layout'  // Sử dụng layout signUpLayout cho trang đăng ký
    });
});
router.post('/login', async function (req, res) {
    const user = await accountService.findByUsername(req.body.username);
    if(!user){
        return res.render('vwAccount/login', {
            layout: 'account-layout',
            showErrors: true
        }); 
    }
    if(!bcrypt.compareSync(req.body.raw_password, user.password)){
        return res.render('vwAccount/login', {
            layout: 'account-layout',
            showErrors: true
        }); 
    }
    req.session.auth = true;
    req.session.authUser = user;
    const retUrl = req.session.retUrl || '/'
    res.redirect(retUrl);
})
router.get('/register', function(req, res){
    res.render('vwAccount/register', {
        layout: 'account-layout'
    });
});
router.post('/register', async function (req, res) {
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
    const ymd_dob = moment(req.body.raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const entity = {
        username: req.body.username,
        password: hash_password, 
        name: req.body.name,
        email: req.body.email, 
        dob: ymd_dob,
        permission: 0
    }

    const ret = await accountService.add(entity);
    res.render('vwAccount/register', {
        layout: 'account-layout'  // Sử dụng layout signUpLayout cho trang đăng ký
    });
});

router.get('/profile', async function(req, res){
    if (!req.session.authUser) {
        return res.redirect('/account/login'); // Nếu session không tồn tại, redirect đến trang đăng nhập
    }

    try {
        const user = req.session.authUser; // Lấy thông tin user từ session
        const Artistlist = await userProfileService.Artist();
        const Albumlist = await userProfileService.Album();
        const UserDashboardlist = await userProfileService.Dashboard();
        const UserSong = await userProfileService.FindSongOfUser(user);

        res.render('vwAccount/userProfile', {
            user: user,
            artists: Artistlist.slice(0, 5),
            albums: Albumlist.slice(0, 5),
            userdashboard: UserDashboardlist,
            userSong: UserSong,
        });
    } catch (error) {
        console.error("Lỗi trong quá trình lấy dữ liệu:", error);
        res.status(500).send("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
});


router.get('/is-available', async function (req, res) {
    const username = req.query.username;
    const user = await accountService.findByUsername(username);
    if(!user){
        return res.json(true); //lay bien du lieu quang xuong
    }
    res.json(false);
})

router.post('/logout', auth, function(req, res){
    req.session.auth = false;
    req.session.authUser = null;
    res.redirect(req.headers.referer);
})

router.get('/forgot-password', (req, res) => {
    res.render('vwAccount/forgot-password', {
        layout: 'account-layout',
    });
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra email tồn tại trong cơ sở dữ liệu
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            return res.render('vwAccount/forgot-password', {
                layout: 'account-layout',
                errorMessage: 'Email không tồn tại trong hệ thống',
            });
        }

        // Tạo OTP và thời gian hết hạn
        const otp = Math.floor(100000 + Math.random() * 900000); // Mã OTP 6 chữ số
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

        // Lưu OTP vào database
        await db.Otp.create({ email, otp, expiresAt });

        // Cấu hình gửi email qua Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com', // Thay bằng email của bạn
                pass: 'your-email-password', // Thay bằng mật khẩu của bạn
            },
        });

        // Nội dung email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Mã OTP để khôi phục mật khẩu',
            text: `Mã OTP của bạn là: ${otp}. Mã sẽ hết hạn sau 10 phút.`,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        // Chuyển đến trang nhập OTP
        res.redirect(`/account/otp?email=${email}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

// Trang OTP (GET)
router.get('/otp', (req, res) => {
    const { email } = req.query; // Nhận email từ URL query
    res.render('vwAccount/otp', {
        layout: 'account-layout',
        email,
    });
});

router.post('/otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Kiểm tra OTP từ database
        const otpRecord = await db.Otp.findOne({ where: { email, otp } });

        if (!otpRecord) {
            return res.render('vwAccount/otp', {
                layout: 'account-layout',
                email,
                errorMessage: 'Mã OTP không hợp lệ.',
            });
        }

        // Kiểm tra thời gian hết hạn
        if (new Date() > otpRecord.expiresAt) {
            return res.render('vwAccount/otp', {
                layout: 'account-layout',
                email,
                errorMessage: 'Mã OTP đã hết hạn.',
            });
        }

        // Nếu hợp lệ, chuyển đến trang đặt lại mật khẩu
        res.redirect(`/account/reset-password?email=${email}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

// Trang xử lý OTP (POST)
router.post('/verify-otp', async function (req, res) {
    const { email, otp } = req.body;

    try {
        // Kiểm tra OTP trong cơ sở dữ liệu
        const storedOtp = await db.Otp.findOne({ where: { email: email, otp: otp } });

        if (!storedOtp) {
            return res.render('vwAccount/otp', {
                layout: 'account-layout',
                email: email,
                errorMessage: 'Mã OTP không chính xác',
            });
        }

        // Nếu OTP hợp lệ, chuyển hướng đến trang đặt lại mật khẩu
        res.redirect(`/account/reset-password?email=${email}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại');
    }
});

// Route POST reset-password (to handle resetting the password)
router.get('/reset-password', (req, res) => {
    const { email } = req.query;
    res.render('vwAccount/reset-password', {
        layout: 'account-layout',
        email,
    });
});

router.post('/reset-password', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hash mật khẩu mới
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Cập nhật mật khẩu trong database
        await db.User.update({ password: hashedPassword }, { where: { email } });

        // Xóa OTP sau khi sử dụng
        await db.Otp.destroy({ where: { email } });

        res.render('vwAccount/reset-password', {
            layout: 'account-layout',
            successMessage: 'Mật khẩu đã được thay đổi thành công.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

configurePassportGithub();
router.get('/login/githubAuth',
    passport.authenticate('github'));

router.get('/login/githubAuth/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Lấy thông tin user từ session do passport tự lưu
    const user = req.user; 

    if (!user) {
      return res.redirect('/login');
     }

    // Đánh dấu người dùng đã đăng nhập
    req.session.auth = true;
    req.session.authUser = user;

    // Chuyển hướng về trang chủ hoặc nơi khác
    res.redirect('/');
  }
);
configurePassportGoogle();
router.get('/login/googleAuth',
  passport.authenticate('google'));

router.get('/login/googleAuth/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Lấy thông tin user từ session do passport tự lưu
    const user = req.user; 

    if (!user) {
      return res.redirect('/login');
     }

    // Đánh dấu người dùng đã đăng nhập
    req.session.auth = true;
    req.session.authUser = user;

    res.redirect('/');
  })
export default router;