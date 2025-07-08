import express from "express";
import newsService from "../services/news.service.js";
import editorService from "../services/editor.service.js";
import fs from "fs";
import multer from "multer";
import path from "path";

const router = express.Router();

async function renderNewsByStatus(req, res, status, viewName) {
  const authorName = req.session.authUser.username;
  const allNews = await newsService.getNewsByAuthorStatus(authorName, status);
  const updatedList = await Promise.all(
    allNews.map(async (news) => {
      const category = await newsService.findCatByCatId(news.CatID); // Sử dụng 'news' thay vì 'new'
      return {
        ...news, 
        catName: category ? category.CatName : "Chưa có danh mục", 
      };
    })
  );


  res.render(viewName, {
    newsList: updatedList,
  });
}

// Homepage route
router.get("/", async function (req, res) {
  res.render("homepage", {});
});
// Create article routes
router.get("/create_article", async (req, res) => {
  const categories = await newsService.getAllCategories();
  res.render("vwWriter/create", { categories });
});
const upload = multer({ dest: "./static/imgs/news/" });
router.post("/create_article", upload.single("ImageFile"), async (req, res) => {
  try {
    const imageFile = req.file;
    const imageUrl = req.body.ImageUrl?.trim();
    const userName = req.session.authUser.username;
    const totalNews = await newsService.countByNews();

    // Validate image input
    if (imageFile && imageUrl) {
      return res.status(400).send("Only one input (file or URL) is allowed");
    }

    let coverImage = "";

    if (imageFile) {
      const imagePath = "./static/imgs/news/";
      const fileName = `news_${totalNews}.jpg`;
      const newFilePath = path.join(imagePath, fileName);
      fs.renameSync(imageFile.path, newFilePath);
      coverImage = `/static/imgs/news/${fileName}`;
    } else if (imageUrl) {
      if (!imageUrl.startsWith("http")) {
        return res.status(400).send("Invalid URL");
      }
      coverImage = imageUrl;
    } else {
      return res.status(400).send("No image provided");
    }

    // Extract form data
    const {
      title,
      abstract,
      content,
      category_child_id,
      tags
    } = req.body;

    const article = {
      Title: title,
      AuthorName: userName,
      Abstract: abstract,
      CatID: Number(category_child_id),
      Content: content,
      Premium: false,
      CreatedDate: new Date(),
      Status: 2,
      ImageCover: coverImage
    };

    await newsService.createArticleWithTags(article, tags);

    res.redirect("/writer/pending_approval?success=Upload%20successful!");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create article" });
  }
});
router.get("/categories/children/:CatID", async (req, res) => {
  const categoryChildren = await newsService.getCategoriesChild(req.params.CatID);
  res.json(categoryChildren);
});

// Approved, Published, Rejected, and Pending routes
router.get("/approved", (req, res) =>
  renderNewsByStatus(req, res, 1, "vwWriter/approved")
);
router.get("/published", (req, res) =>
  renderNewsByStatus(req, res, 3, "vwWriter/published")
);
router.get("/rejected", (req, res) =>
  renderNewsByStatus(req, res, 4, "vwWriter/rejected")
);
router.get("/pending_approval", (req, res) =>
  renderNewsByStatus(req, res, 2, "vwWriter/pending_approval")
);

export default router;
