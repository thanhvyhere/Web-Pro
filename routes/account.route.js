import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment'; // format month day
import multer from 'multer';
import dotenv from 'dotenv';
import accountService from '../services/account.service.js';
import auth, { checkPremium } from '../middleware/auth.mdw.js';
import configurePassportGithub from '../controllers/passportGithub.config.js';
import configurePassportGoogle from '../controllers/passportGoogle.config.js';
import passport from 'passport';
import nodemailer from 'nodemailer';
import newsService from '../services/news.service.js';

const router = express.Router();
dotenv.config();

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
            showErrors: true,
        }); 
    }
    const role = await accountService.findRoleById(user.permission);
    req.session.auth = true;
    req.session.authUser = {
        username: user.username,
        userid: user.id,
        name: user.name,
        permission: user.permission,
        rolename: role.RoleName
    };

    const retUrl = req.session.retUrl || '/'
    console.log('Redirecting to:', retUrl); 
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
        permission: 1
    }
    const ret = await accountService.add(entity);
    const user = await accountService.findByUsername(req.body.username);
    req.session.auth = true;
    req.session.authUser = user;
    const retUrl = req.session.retUrl || '/'
    res.redirect(retUrl);
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
    res.redirect('/');
})

router.get('/forgot-password', function (req, res) {
    res.render('vwAccount/forgot-password', {
        layout: 'account-layout',
    });
});

router.post('/forgot-password', async function(req, res) {
    const email = req.body.email || '';
    const username = req.body.username || '';
    try {
        // Kiểm tra email tồn tại trong cơ sở dữ liệu
        const user = await accountService.findByUsername(username);
        if (!user) {
            return res.render('vwAccount/forgot-password', {
                layout: 'account-layout',
                errorMessage: 'Không có người dùng trong hệ thống',
            });
        }
        if (user.email !== email) {
            return res.render('vwAccount/forgot-password', {
                layout: 'account-layout',
                errorMessage: 'Email không trùng khớp',
            });
        }

        // Tạo OTP và thời gian hết hạn
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expriteAt = new Date(Date.now() + 10 * 60 * 1000);
        const newOTP = {
            otp: otp, 
            expire_time: expriteAt, 
            email: email
        }   
        
        const ret = await accountService.addOTP(newOTP);
        // Cấu hình gửi email qua Nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587, // Hoặc 465 nếu sử dụng SSL
            secure: false, // true cho 465, false cho 587
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PW,
            },
        });
        // Nội dung email
        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: '[RESET PASSWORD] - NEWSLAND SENT YOU',
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
router.get('/otp', function (req, res) {
    const email= req.query.email; // Nhận email từ URL query
    res.render('vwAccount/otp', {
        layout: 'account-layout',
        email: email
    });
});

router.post('/otp', async function (req, res) {
    const email = req.body.email || '';
    const otp = req.body.otp || '';
    try {
        const otpRecord = await accountService.findOTPByEmail(email);
        console.log(otpRecord);
        if (!otpRecord) {
            return res.render('vwAccount/otp', {
                layout: 'account-layout',
                email: email,
                errorMessage: 'Mã OTP không hợp lệ.',
            });
        }

        // Kiểm tra thời gian hết hạn
        if (otp !== otpRecord.otp) {
            console.log(otp);
            console.log(otpRecord.otp);
            return res.render('vwAccount/otp', {
                layout: 'account-layout',
                email: email,
                errorMessage: 'Nhập sai mã OTP, yêu cầu nhập lại',
            });
        }
        const ret = await accountService.delOTP(otp);
        // Nếu hợp lệ, chuyển đến trang đặt lại mật khẩu
        res.redirect(`/account/reset-password?email=${email}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

// Route POST reset-password (to handle resetting the password)
router.get('/reset-password', function (req, res) {
    const email = req.query.email || '';
    res.render('vwAccount/reset-password', {
        layout: 'account-layout',
        email: email
    });
});

router.post('/reset-password', async function (req, res) {
    const email = req.body.email || '';
    try {
        // Hash mật khẩu mới
        const hashedPassword = bcrypt.hashSync(req.body.raw_password, 8);
        // Cập nhật mật khẩu trong database
        const ret = await accountService.updatePassword(email, hashedPassword);

        // Xóa OTP sau khi sử dụng
        res.render('vwAccount/login', {
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
  async function (req, res) {
    // Lấy thông tin user từ session do passport tự lưu
    const user = req.user; 

    if (!user) {
      return res.redirect('/login');
     }

      // Đánh dấu người dùng đã đăng nhập
    const role = await accountService.findRoleById(user.permission);
    console.log(user.permission)
    req.session.auth = true;
    req.session.authUser = {
        username: user.username,
        userid: user.id,
        name: user.name,
        permission: user.permission,
        rolename: role.RoleName
    };
    // Chuyển hướng về trang chủ hoặc nơi khác
    res.redirect('/subscriber');
  }
);
configurePassportGoogle();
router.get('/login/googleAuth',
  passport.authenticate('google'));

router.get('/login/googleAuth/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function (req, res) {
    // Lấy thông tin user từ session do passport tự lưu
    const user = req.user; 
    if (!user) {
      return res.redirect('/login');
     }
    const role = await accountService.findRoleById(user.permission);
    // Đánh dấu người dùng đã đăng nhập
    req.session.auth = true;
    req.session.authUser = {
        username: user.username,
        userid: user.id,
        name: user.name,
        permission: user.permission,
        rolename: role.RoleName
    };
    res.redirect('/subscriber');
    })
  
router.post('/premium', async function (req, res) {
    try {
        // Lấy ID của người dùng hiện tại từ session
        const userId = req.session.authUser.userid;
        const account = await accountService.findPremiumByUserId(userId) || 0;

        let expirationDate;

        if (account === 0) {
            // Nếu tài khoản chưa có, đặt ngày hết hạn là 7 phút từ bây giờ
            expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 7);

            const entity = {
                id: userId, // ID người dùng
                expiration_date: expirationDate, // Ngày hết hạn
                created_at: new Date(), // Ngày tạo
            };

            await accountService.addPremium(entity);
            await accountService.updatePermission(userId, 2);

            // Cập nhật session với quyền mới
            req.session.authUser.permission = 2;
            req.session.authPremium = true;
        } else {
            // Nếu tài khoản đã có, kiểm tra expiration_date
            if (!account.expiration_date) {
                throw new Error("Missing expiration_date in account.");
            }

            expirationDate = new Date(account.expiration_date);

            // Kiểm tra nếu expiration_date không hợp lệ
            if (isNaN(expirationDate)) {
                throw new Error("Invalid expiration_date format in database.");
            }

            // Cộng thêm 7 phút
            expirationDate.setMinutes(expirationDate.getMinutes() + 7);

            // Cập nhật ngày hết hạn
            await accountService.updatePremium(userId, expirationDate);
        }

        // Cập nhật session với quyền mới (nếu cần)
        req.session.authUser.permission = 2;
        req.session.authPremium = true;

        // Phản hồi thành công
        res.json({
            message: 'Đăng kí gói Premium thành công!',
            expiration_date: expirationDate,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to activate premium account.',
            error: err.message,
        });
    }
});




export default router;