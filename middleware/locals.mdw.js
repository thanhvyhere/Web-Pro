import newsService from "../services/news.service.js";
import accountService from "../services/account.service.js";
import administratorService from "../services/administrator.service.js";
import editorService from "../services/editor.service.js";
import subcriberService from "../services/subcriber.service.js";
import session from "express-session";

export default function (app) {
  app.use(async function (req, res, next) {
    if (!req.session.auth) {
      req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser || null; // Đảm bảo authUser luôn có giá trị
    if (req.session.authUser && req.session.authUser.permission > 1) {
      req.session.authPremium = true;
      res.locals.authPremium = true;
    } else {
      res.locals.authPremium = false;
      req.session.authPremium = false;
    }

    // Kiểm tra authUser trước khi truy cập thuộc tính permission

    next();
  });

  app.use(async (req, res, next) => {
    const categories = await newsService.getAllCategoriesWithChildren();
    const limitCate = categories.slice(0, 8);

    // Lưu vào res.locals để có thể sử dụng trong tất cả các view
    res.locals.categories = categories;
    res.locals.limitCate = limitCate;

    // Tiếp tục xử lý request
    next();
  });

  app.use(async (req, res, next) => {
    const topNews = await newsService.getTop3NewsByView();
    // Đếm số lượng bình luận cho từng bài báo trong top3 và lấy tên danh mục
    const updatedList = await Promise.all(
      topNews.map(async (item) => {
        const count = await newsService.countCommentBynewsId(item.NewsID);
        const tags = await newsService.getTagByNewsId(item.NewsID);
        const authPremium = req.session.authPremium;
        let is_premium;
        if (item.Premium === 1) is_premium = true;
        else is_premium = false;
        return {
          ...item,
          countComment: count.total, // Đảm bảo trả về đúng số lượng bình luận
          tags: tags,
          authPremium,
          is_premium,
        };
      })
    );
    res.locals.topNews = updatedList;
    next();
  });

  app.use(async (req, res, next) => {
    const colors = [
      "#F3DB8E", // vàng nhạt
      "#BCE6F4", // xanh dương nhạt
      "#F3A7C0", // hồng nhạt
      "#C1F1C1", // xanh lá nhạt
      "#E7D1F3", // tím nhạt
      "#FFDFB9", // cam nhạt
      "#D2E0FB", // xanh pastel
      "#FFD6E8", // hồng pastel
      "#D5F5E3", // xanh lá pastel
      "#E6E6FA", // tím lavender
    ];

    const topCatRaw = await newsService.getTop10Cat();
    const topCat = topCatRaw.map((cat, index) => ({
      ...cat,
      No: index + 1,
      color: colors[index % colors.length],
    }));

    res.locals.topCat = topCat;
    next();
  });

  app.use(async (req, res, next) => {
    const newNews = await newsService.getTop10NewsByDate();
    const updatedList = await Promise.all(
      newNews.map(async (item) => {
        const count = await newsService.countCommentBynewsId(item.NewsID);
        const tags = await newsService.getTagByNewsId(item.NewsID);
        return {
          ...item,
          countComment: count.total, // Đảm bảo trả về đúng số lượng bình luận
          tags: tags,
        };
      })
    );
    res.locals.newNews = updatedList;
    next();
  });

  app.use(async (req, res, next) => {
    const viewsNews = await newsService.getTop10NewsByViews();
    const updatedList = await Promise.all(
      viewsNews.map(async (item) => {
        const count = await newsService.countCommentBynewsId(item.NewsID);
        const tags = await newsService.getTagByNewsId(item.NewsID);
        return {
          ...item,
          countComment: count.total, // Đảm bảo trả về đúng số lượng bình luận
          tags: tags,
        };
      })
    );
    res.locals.viewsNews = updatedList;
    next();
  });

  app.use(async (req, res, next) => {
    const randomNews = await newsService.getTop3NewsByRandom();
    const updatedList = await Promise.all(
      randomNews.map(async (item) => {
        const count = await newsService.countCommentBynewsId(item.NewsID);
        const tags = await newsService.getTagByNewsId(item.NewsID);
        return {
          ...item,
          countComment: count.total, // Đảm bảo trả về đúng số lượng bình luận
          tags: tags,
        };
      })
    );
    res.locals.randomNews = updatedList;
    next();
  });
  app.use(async function (req, res, next) {
    let roleNum = req.session.authUser ? req.session.authUser.permission : 1;
    let rolePort;
    switch (roleNum) {
      case 2: // Subscriber
        rolePort = "subscriber";
        break;
      case 3: // Writer
        rolePort = "writer";
        break;
      case 4: // Editor
        rolePort = "editor";
        break;
      case 5: // Admin
        rolePort = "administrator";
        break;
    }
    if (
      rolePort === "editor" ||
      rolePort === "administrator" ||
      rolePort === "writer" ||
      rolePort === "subscriber"
    ) {
      try {
        const permission = await accountService.findByRoleName(rolePort);
        const roleFeature = await accountService.roleFeature(permission.RoleID);
        res.locals.lcFeatureRoles = roleFeature;
        res.locals.roleName = rolePort;
      } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu cho port: ${rolePort}`, error);
      }
    }
    next();
  });
}
