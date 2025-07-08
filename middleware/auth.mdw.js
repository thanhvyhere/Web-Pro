import accountService from "../services/account.service.js";
import newsService from "../services/news.service.js";

export default function (req, res, next) {
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/account/login");
  }
  next();
}

export async function checkPremium(req, res, next) {
  try {
    if (req.session.authUser && req.session.authUser.rolename == "subscriber") {
      const userId = req.session.authUser.userid || "0";

      // Tìm thông tin Premium của người dùng
      const accPre = await accountService.findbyID(userId).lean();

      if (accPre) {
        const currentDate = new Date();

        // So sánh ngày hết hạn với ngày hiện tại
        if (new Date(accPre.expiration_date) < currentDate) {
          // Nếu hết hạn, xóa quyền Premium và cập nhật quyền về cơ bản
          await accountService.updatePremiumDate(userId, null);

          req.session.authPremium = false;
          req.session.authUser.expiration_date = null;
        } else {
          req.session.authPremium = true;
        }
      } else {
        // Nếu không có Premium, đảm bảo session phản ánh điều này
        req.session.authPremium = false;
      }
    }

    // Tiếp tục xử lý middleware tiếp theo
    next();
  } catch (err) {
    console.error("Error in checkPremium middleware:", err);

    // Trả về lỗi nếu xảy ra vấn đề trong quá trình kiểm tra
    res.status(500).json({
      message: "An error occurred while checking premium status.",
      error: err.message,
    });
  }
}

export function authAdmin(req, res, next) {
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/account/login");
  }

  if (req.session.authUser.permission < 5) {
    // Render trang homepage và gửi thông báo lỗi qua locals
    return res.render("homepage", { message: "Không đủ quyền để truy cập." });
  }

  next();
}

export function authWriter(req, res, next) {
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/account/login");
  }

  if (
    req.session.authUser.permission !== 3 ||
    req.session.authUser.permission !== 5
  ) {
    // Render trang homepage và gửi thông báo lỗi qua locals
    return res.render("homepage", { message: "Không đủ quyền để truy cập." });
  }

  next();
}

export function authEditor(req, res, next) {
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/account/login");
  }

  if (req.session.authUser.permission < 4) {
    // Render trang homepage và gửi thông báo lỗi qua locals
    return res.render("homepage", { message: "Không đủ quyền để truy cập." });
  }

  next();
}
