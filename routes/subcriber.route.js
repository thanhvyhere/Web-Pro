import express from "express";
import newsService from "../services/news.service.js";
import subcriberService from "../services/subcriber.service.js";
import PDFDocument from "pdfkit";
import * as cheerio from "cheerio";
import axios from "axios";
const router = express.Router();
router.get("/", async function (req, res) {
  res.render("homepage", {});
});
// library
router.get("/library", async function (req, res) {
  if (req.session.authUser) {
    console.log(req.session.authUser.userid);
  } else {
    return res.redirect("/account/login");
  }
  const userid = req.session.authUser.userid;
  const limit = 6;
  const current_page = req.query.page || 1;
  const offset = (current_page - 1) * limit;
  const nRows = await newsService.countByPreNews();
  const nPages = Math.ceil(nRows.total / limit);
  const pageNumbers = [];
  for (let i = 0; i < nPages; i++) {
    pageNumbers.push({
      value: i + 1,
      active: i + 1 === +current_page,
    });
  }
  const limit2 = 3;
  const current_page2 = req.query.page2 || 1;
  const offset2 = (current_page - 1) * limit2;
  const nRows2 = await newsService.countByNews();

  const nPages2 = Math.ceil(nRows2.total / limit2);
  const pageNumbers2 = [];
  for (let i = 0; i < nPages2; i++) {
    pageNumbers2.push({
      value: i + 1,
      active: i + 1 === +current_page2,
    });
  }

  const list = await subcriberService.findPageById(limit, offset, userid);
  const randlist = await subcriberService.findRandById(limit2, offset2, userid);
  const updatedList = list.map((item) => ({
    ...item,
    userid: userid, // Gắn parentCatList vào từng phần tử
  }));
  const updatedList2 = randlist.map((item) => ({
    ...item,
    userid: userid, // Gắn parentCatList vào từng phần tử
  }));
  res.render("vwSubscriber/library", {
    news: updatedList,
    empty: updatedList.length === 0,
    pageNumbers: pageNumbers,
    randomNews: updatedList2,
    pageNumbers2: pageNumbers2,
  });
});
router.get("/article/:id", async (req, res) => {
  const articleId = req.params.id; // Sửa lại cho đúng với NewsID
  const userId = req.session.id; // ID tài khoản đang đăng nhập

  // Kiểm tra xem bài báo đã được lưu chưa
  const isSaved = await subcriberService.savedNews(userId, articleId);
  const news = await subcriberService.findSavedPreNewsById(userId);

  res.render("vwSubscriber/saved", {
    news: news,
    isSaved: !!isSaved, // true nếu đã lưu, false nếu chưa
  });
});
router.post("/save-article", async (req, res) => {
  const { NewsID, id, saved } = req.body; // Nhận thông tin từ request
  try {
    if (saved) {
      // Lưu bài báo
      await subcriberService.saveSaved(NewsID, id);
    } else {
      // Bỏ lưu bài báo
      await subcriberService.delSaved(NewsID, id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Lỗi khi lưu trạng thái:", error);
    res.status(500).json({ success: false, message: "Lỗi khi lưu trạng thái" });
  }
});
// downloaded
router.post("/download-article", async (req, res) => {
  const { NewsID } = req.body; // Lấy NewsID từ body

  try {
    // Lấy nội dung bài báo từ database (giả sử là HTML)
    const article = await subcriberService.findNews(NewsID);

    if (!article) {
      return res.status(404).send("Bài báo không tìm thấy");
    }

    // Chuyển đổi nội dung HTML thành văn bản thuần túy (plain text)
    const plainTextContent = article.Content.replace(/<\/?[^>]+(>|$)/g, ""); // Loại bỏ HTML tags
    const Title = article.Title;
    const CoverImage = article.ImageCover.trim();
    console.log(CoverImage);
    // Tạo file PDF
    const doc = new PDFDocument({ size: "A4" });
    const filename = `article-${NewsID}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.registerFont("Roboto", "./static/font/Roboto-Regular.ttf");

    doc
      .font("Roboto")
      .fontSize(18) // Font lớn hơn cho tiêu đề
      .text(Title, {
        align: "center",
        lineGap: 10,
      })
      .moveDown(1); // Tạo khoảng cách giữa tiêu đề và nội dung

    // Thêm ảnh bìa
    if (CoverImage) {
      try {
        // Nếu CoverImage là URL
        if (CoverImage.startsWith("http")) {
          const response = await axios({
            url: CoverImage,
            responseType: "arraybuffer",
          });
          const imageBuffer = Buffer.from(response.data, "binary");
          doc.image(imageBuffer, {
            fit: [400, 300], // Kích thước ảnh bìa
            align: "center",
          });
          doc.moveDown(10);
        } else {
          // Nếu CoverImage là đường dẫn cục bộ
          doc.image(CoverImage, {
            fit: [400, 300], // Kích thước ảnh bìa
            align: "center",
          });
          doc.moveDown(10);
        }
        doc.moveDown(1); // Tạo khoảng cách giữa ảnh bìa và nội dung
      } catch (error) {
        console.error("Không thể tải ảnh bìa:", error);
      }
    }
    doc.moveDown(2);
    // Thêm nội dung bài báo
    doc.font("Roboto").fontSize(12).text(plainTextContent, {
      align: "justify",
      lineGap: 5,
      width: 410, // Giới hạn chiều rộng văn bản
    });

    // Kết thúc và trả về file PDF
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Lỗi khi tạo PDF:", error);
    res.status(500).send("Lỗi khi tạo PDF");
  }
});

router.get("/saved", async function (req, res) {
  if (req.session.authUser) {
    console.log(req.session.authUser.userid);
  } else {
    return res.redirect("/account/login");
  }
  const userid = req.session.authUser.userid;

  // Kiểm tra xem bài báo đã được lưu chưa
  const news = await subcriberService.savedNewsByUserID(userid);
  const updatedList = news.map((item) => ({
    ...item,
    isSaved: true, // Gắn parentCatList vào từng phần tử
    userid: userid,
  }));
  res.render("vwSubscriber/saved", {
    news: updatedList, // true nếu đã lưu, false nếu chưa
  });
});
// premium
router.get("/premium", async function (req, res) {
  if (req.session.authUser) {
    console.log(req.session.authUser.userid);
  } else {
    return res.redirect("/account/login");
  }
  const userid = req.session.authUser.userid;
  const limit = 6;
  const current_page = req.query.page || 1;
  const offset = (current_page - 1) * limit;
  const nRows = await newsService.countByPreNews();
  const nPages = Math.ceil(nRows.total / limit);
  const pageNumbers = [];
  for (let i = 0; i < nPages; i++) {
    pageNumbers.push({
      value: i + 1,
      active: i + 1 === +current_page,
    });
  }
  const list = await subcriberService.findPageById(limit, offset, userid);
  const updatedList = list.map((item) => ({
    ...item,
    userid: userid, // Gắn parentCatList vào từng phần tử
  }));
  res.render("vwSubscriber/premium", {
    news: updatedList,
    empty: list.length === 0,
    pageNumbers: pageNumbers,
  });
});
export default router;
