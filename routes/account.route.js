import express from "express";
import bcrypt from "bcryptjs";
import moment from "moment"; // format month day
import multer from "multer";
import dotenv from "dotenv";
import accountService from "../services/account.service.js";
import auth, { checkPremium } from "../middleware/auth.mdw.js";
import configurePassportGithub from "../controllers/passportGithub.config.js";
import configurePassportGoogle from "../controllers/passportGoogle.config.js";
import passport from "passport";
import { sendEmailRegister, sendEmailResetPassword } from "../utils/mailer.js";
import newsService from "../services/news.service.js";
configurePassportGithub();
const router = express.Router();
dotenv.config();

router.get("/login", function (req, res) {
  res.render("vwAccount/login", {
    layout: false,
  });
});

router.post("/login", async function (req, res) {
  const user = await accountService.findByUsername(req.body.username).lean();
  if (!user) {
    return res.render("homepage", {
      showErrors: true,
    });
  }
  if (!bcrypt.compareSync(req.body.raw_password, user.password)) {
    return res.render("homepage", {
      showErrors: true,
    });
  }

  const preDate = user.expiration_date || null;
  const role = user.role;
  req.session.auth = true;

  let expirationDate = null;

  // Kiểm tra nếu preDate và expiration_date có giá trị hợp lệ
  if (preDate) {
    expirationDate = new Date(preDate);

    if (isNaN(expirationDate.getTime())) {
      expirationDate = null; // Nếu không hợp lệ, gán lại null
    } else {
      // Nếu có expiration_date hợp lệ, cộng thêm 7 ngày
      expirationDate.setDate(expirationDate.getDate() + 7);
    }
  }

  req.session.authUser = {
    username: user.username || user.name || null,
    userid: user._id,
    email: user.email,
    name: user.name,
    permission: user.permission,
    role: role,
    expiration_date: expirationDate,
  };

  const retUrl = req.session.retUrl || "/";
  res.redirect(retUrl);
});



router.post('/register', async function (req, res) {
  const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
  const tempUser = {
    name: req.body.name,
    username: req.body.username,
    password: hash_password,
    phone: req.body.phone,
    email: req.body.email,
  };

  const otp = Math.floor(1000 + Math.random() * 9000);
  const expireAt = new Date(Date.now() + 2 * 60 * 1000);

  await accountService.addOTP({
    otp: otp,
    expire_time: expireAt,
    email: tempUser.email,
  });

  const subject = "[VERIFY EMAIL] - NEWSLAND REGISTRATION";
  const html = `
        <h3 Email Verification</h3>
        <p>Thank you for registering at Newsland.</p>
        <p>Your verification code is:</p>
        <h2>${otp}</h2>
        <p>This code is valid for 1 minutes.</p>
    `;

  try {
    setTimeout(() => {
      sendEmailRegister(tempUser.email, subject, html)
        .then(() => console.log("Verification email sent."))
        .catch((err) => console.error("Failed to send email:", err));
    }, 500);
    req.session.tempUser = tempUser;
    
    return res.json({
      success: true,
      email: req.body.email,
      username: req.body.username,
      successMessage: "Your code was sent to your email"
    });

  } catch (err) {
    console.error("Failed to send verification email:", err);
    return res
      .status(500)
      .json({ showVerifyPopup: false, errorMessage: "Failed to send OTP email." });
  }
});
router.post("/verify-email", async function (req, res) {
  const { email, username, otp } = req.body;
  console.log(email);

  try {
    const otpRecord = await accountService.findOTPByEmail(email).lean();
    console.log("otp: ",otpRecord);

    if (!otpRecord) {
      return res.status(400).json({
        status: "error",
        type: "expired",
        message: "OTP expired. Please register again.",
        email,
        username,
      });
    }

    if (parseInt(otp) !== otpRecord.otp) {
      return res.status(400).json({
        status: "error",
        type: "incorrect",
        message: "Incorrect OTP. Please try again.",
        email,
        username,
      });
    }

    const tempUser = req.session.tempUser;
    if (!tempUser) {
      return res.status(400).json({
        status: "error",
        type: "session",
        message: "Session expired. Please register again.",
      });
    }

    await accountService.add(tempUser);
    await accountService.delOTP(otp);
    req.session.tempUser = null;

    return res.status(200).json({
      status: "success",
      message: "Email verified. Account created successfully!",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      type: "server",
      message: "Server error. Please try again later.",
    });
  }
});

router.post('/resend-otp', async function (req, res) {
  const { email, username } = req.session.tempUser;

  try {
    const newOtp = Math.floor(1000 + Math.random() * 9000); // Tạo OTP
    const expireAt = new Date(Date.now() + 2 * 60 * 1000); // Hết hạn sau 2 phút
    console.log(email);
    // Lưu hoặc cập nhật OTP
    await accountService.saveOrUpdateOTP(email, newOtp, expireAt);

    const subject = "[VERIFY EMAIL] - NEWSLAND REGISTRATION";
    const html = `
      <h3>Email Verification</h3>
      <p>Thank you for registering at Newsland.</p>
      <p>Your verification code is:</p>
      <h2>${newOtp}</h2>
      <p>This code is valid for 2 minutes.</p>
    `;

    // Gửi email xác thực
    await sendEmailRegister(email, subject, html);

    res.status(200).json({
      status: 'success',
      message: 'A new OTP has been sent to your email.',
    });
  } catch (err) {
    console.error('Error resending OTP:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to resend OTP. Please try again later.',
    });
  }
});

router.post("/logout", auth, function (req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  res.redirect("/");
});

router.get("/forgot-password", function (req, res) {
  res.render("vwAccount/forgot-password", {
    layout: "account-layout",
  });
});

router.post("/forgot-password", async function (req, res) {
  const email = req.body.email || "";
  const username = req.body.username || "";
  try {
    // Kiểm tra email tồn tại trong cơ sở dữ liệu
    const user = await accountService.findByUsername(username).lean();
    if (!user) {
      return res.render("vwAccount/forgot-password", {
        layout: "account-layout",
        errorMessage: "Không có người dùng trong hệ thống",
      });
    }
    if (user.email !== email) {
      return res.render("vwAccount/forgot-password", {
        layout: "account-layout",
        errorMessage: "Email không trùng khớp",
      });
    }

    // Tạo OTP và thời gian hết hạn
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expriteAt = new Date(Date.now() + 10 * 60 * 1000);
    const newOTP = {
      otp: otp,
      expire_time: expriteAt,
      email: email,
    };

    const ret = await accountService.addOTP(newOTP);
    // Cấu hình gửi email qua Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PW,
      },
    });
    // Nội dung email
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "[RESET PASSWORD] - NEWSLAND SENT YOU",
      text: `Mã OTP của bạn là: ${otp}. Mã sẽ hết hạn sau 10 phút.`,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    // Chuyển đến trang nhập OTP
    res.redirect(`/account/otp?email=${email}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Có lỗi xảy ra, vui lòng thử lại sau.");
  }
});
router.get("/is-available", async function (req, res) {
  const username = req.query.username;
  const user = await accountService.findByUsername(username);
  if (!user) {
    return res.json(true);
  }
  res.json(false);
});



router.get("/otp", function (req, res) {
  const email = req.query.email; // Nhận email từ URL query
  res.render("vwAccount/otp", {
    layout: "account-layout",
    email: email,
  });
});

router.post("/otp", async function (req, res) {
  const email = req.body.email || "";
  const otp = req.body.otp || "";
  try {
    const otpRecord = await accountService.findOTPByEmail(email);
    if (!otpRecord) {
      return res.render("vwAccount/otp", {
        layout: "account-layout",
        email: email,
        errorMessage: "Mã OTP không hợp lệ.",
      });
    }

    // Kiểm tra thời gian hết hạn
    if (otp !== otpRecord.otp) {
      return res.render("vwAccount/otp", {
        layout: "account-layout",
        email: email,
        errorMessage: "Nhập sai mã OTP, yêu cầu nhập lại",
      });
    }
    const ret = await accountService.delOTP(otp);
    // Nếu hợp lệ, chuyển đến trang đặt lại mật khẩu
    res.redirect(`/account/reset-password?email=${email}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Có lỗi xảy ra, vui lòng thử lại sau.");
  }
});

// Route POST reset-password (to handle resetting the password)
router.get("/reset-password", function (req, res) {
  const email = req.query.email || "";
  res.render("vwAccount/reset-password", {
    layout: "account-layout",
    email: email,
  });
});

router.post("/reset-password", async function (req, res) {
  const email = req.body.email || "";
  try {
    // Hash mật khẩu mới
    const hashedPassword = bcrypt.hashSync(req.body.raw_password, 8);
    // Cập nhật mật khẩu trong database
    const ret = await accountService.updatePassword(email, hashedPassword);

    // Xóa OTP sau khi sử dụng
    res.render("vwAccount/login", {
      layout: "account-layout",
      successMessage: "Mật khẩu đã được thay đổi thành công.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Có lỗi xảy ra, vui lòng thử lại sau.");
  }
});

router.get("/login/githubAuth", passport.authenticate("github"));

router.get(
  "/login/githubAuth/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async function (req, res) {
    // Lấy thông tin user từ session do passport tự lưu
    let user = req.user;

    if (!user) {
      return res.redirect("/account/login");
    }
    user = await accountService.findByUsername(user.username).lean();

    const preDate = user.expiration_date || null;

    req.session.auth = true;

    let expirationDate = null;
    if (preDate && preDate.expiration_date) {
      expirationDate = new Date(preDate.expiration_date);

      if (isNaN(expirationDate.getTime())) {
        expirationDate = null;
      }
    }

    req.session.authUser = {
      username: user.username,
      userid: user._id,
      name: user.name,
      permission: user.permission,
      email: user.email,
      rolename: user.role,
      expiration_date: expirationDate,
    };

    res.redirect("/subscriber");
  }
);

configurePassportGoogle();
router.get("/login/googleAuth", passport.authenticate("google"));

router.get(
  "/login/googleAuth/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async function (req, res) {
    // Lấy thông tin user từ session do passport tự lưu
    const user = req.user;
    if (!user) {
      return res.redirect("/login");
    }
    req.session.auth = true;
    req.session.authUser = {
      username: user.username,
      userid: user._id,
      name: user.name,
      email: user.email,
      rolename: user.role,
    };
    res.redirect("/subscriber");
  }
);

router.post("/premium", async function (req, res) {
  try {
    const userId = req.session.authUser.userid;
    const account = (await accountService.findbyID(userId).lean()) || "";

    let expirationDate;

    if (account === "") {
      expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      const entity = {
        id: userId, // ID người dùng
        expiration_date: expirationDate, // Ngày hết hạn
        created_at: new Date(), // Ngày tạo
      };
      await accountService.upPremium(userId);
      req.session.authUser.rolename = "subscribers";
      req.session.authPremium = true;
    } else {
      if (!account.expiration_date) {
        throw new Error("Missing expiration_date in account.");
      }

      expirationDate = new Date(account.expiration_date);

      // Kiểm tra nếu expiration_date không hợp lệ
      if (isNaN(expirationDate)) {
        throw new Error("Invalid expiration_date format in database.");
      }
      expirationDate.setDate(expirationDate.getDate() + 7);

      await accountService.updatePremiumDate(userId, expirationDate);
    }
    req.session.authPremium = true;
    req.session.authUser.rolename = "subscriber";
    req.session.authUser.expiration_date = expirationDate;
    // Phản hồi thành công
    res.json({
      message: "Đăng kí gói Premium thành công!",
      expiration_date: expirationDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to activate premium account.",
      error: err.message,
    });
  }
});

// GET /premium route
router.get("/premium", function (req, res) {
  const userId = req.session.authUser ? req.session.authUser.userid : null;
  if (!userId) {
    // Trả về thông báo yêu cầu đăng nhập
    return res.render("vwAccount/premium", {
      errorMessage: "Bạn cần đăng nhập để đăng ký gói Premium.",
    });
  }

  const username = req.session.authUser.username; // Lấy username từ session

  accountService
    .findPremiumRegisterByUserId(userId)
    .then((account) => {
      const hasPremium = account ? true : false;
      const expirationDate = account ? account.expiration_date : null;

      res.render("vwAccount/premium", {
        hasPremium,
        expirationDate,
        username,
        userId, // Truyền userId vào view
      });
    })
    .catch((err) => {
      console.error("Error fetching premium account:", err);
      res.status(500).json({ message: "Lỗi khi truy vấn dữ liệu" });
    });
});

// Hiển thị trang thông tin người dùng
router.get("/user-info", async function (req, res) {
  const userId = req.query.id; // Lấy userId từ session
  const user = await accountService.findbyID(userId).lean();
  if (!user) {
    return res.redirect("/account/login");
  }

  // Định dạng ngày sinh cho input type="date"
  const formattedDob = user.dob ? moment(user.dob).format("YYYY-MM-DD") : "";

  res.render("vwAccount/user-info", {
    layout: "account-layout", // Chỉ định layout
    user: { ...user, dob: formattedDob }, // Gắn ngày sinh đã định dạng vào object user
    rolename: user.role,
  });
});

router.post("/update", async function (req, res) {
  const userId = req.body.id || "";
  if (!userId) {
    return res.redirect("/account/login");
  }
  const { username, name, email, dob } = req.body; // Thêm dob

  if (!dob || isNaN(Date.parse(dob))) {
    return res.status(400).send("Ngày sinh không hợp lệ");
  }

  const entity = {
    username: username,
    name: name,
    email: email,
    dob: dob, // Bao gồm dob trong entity
  };

  try {
    await accountService.updateUser(userId, entity); // Cập nhật toàn bộ thông tin
    const retUrl = req.session.retUrl || "/";
    res.redirect(retUrl);
  } catch (err) {
    console.error("Error updating user info:", err);
    res.status(500).send("Lỗi server");
  }
});

export default router;
