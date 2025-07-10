import express from "express";
import editorService from "../services/editor.service.js";
import moment from "moment";
const router = express.Router();
const role = "editor";
router.get("/", async function (req, res) {
  res.render("homepage");
});

// repository
router.get("/repository", async function (req, res) {
  const limit = 6;
  const current_page = req.query.page || 1;
  const offset = (current_page - 1) * limit;
  const nRows = await editorService.countByNews();
  const nPages = Math.ceil(nRows.total / limit);
  const pageNumbers = [];
  for (let i = 0; i < nPages; i++) {
    pageNumbers.push({
      value: i + 1,
      active: i + 1 === +current_page,
    });
  }
  const list = await editorService.findPageById(limit, offset);
  res.render("vwEditor/storage", {
    news: list,
    empty: list.length === 0,
    pageNumbers: pageNumbers,
  });
});
// reviewed
router.get("/reviewed", async function (req, res) {
  const list = await editorService.findReviewed();
  res.render("vwEditor/reviewed", { news: list });
});
// editor_rejected
router.get("/editor_rejected", async function (req, res) {
  const list = await editorService.findRejected();

  res.render("vwEditor/rejected", { news: list });
});
// editor_approved
router.get("/editor_approved", async function (req, res) {
  
  const list = await editorService.findApproved();

  res.render("vwEditor/approved", { news: list });
});
// schedule
router.get("/schedule", async function (req, res) {
  
  try {
    const list = await editorService.findApproved();
    console.log("Updated List:", list); // Kiểm tra dữ liệu đã cập nhật
    res.render("vwEditor/schedule", {
      news: list,
      empty: list.length === 0,
    });
  } catch (error) {
    console.error("Error:", error); // Ghi lỗi ra console
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getChildCategories/:parentCatId", async (req, res) => {
  const parentCatId = req.params.parentCatId;

  try {
    const childCat = await editorService.findChildCat(parentCatId);
    if (!childCat || childCat.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(childCat);
  } catch (error) {
    console.error("Lỗi khi truy xuất danh mục con:", error);
    res.status(500).send("Lỗi server");
  }
});
router.get("/feedback", async function (req, res) {
  
  const id = req.query.id;
  const news = await editorService.findNewsByID(id);

  res.render("vwEditor/feedback", { news: news});
});
router.post("/feedback", async function (req, res) {
  const id = req.body.NewsID;
  const changes = {
    Feedback: req.body.Feedback,
    Status: req.body.Status,
  };

  await editorService.update(id, changes);
  res.redirect("/editor/reviewed");
});
router.get("/modify", async function (req, res) {
  
  const id = req.query.id;
  const news = await editorService.findANews(id);
  const parentcatList = await editorService.findParentCat();
  const tags = await editorService.findTags(id);
  const updatedNews = {
    ...news.toObject?.() ?? news,
    parentCatList: parentcatList,
    tags: tags,
  };
  res.render("vwEditor/editAfterProved", { newsList: updatedNews });
});
router.post("/modify", async (req, res) => {
  try {
    console.log("Received body:", req.body); // Kiểm tra xem dữ liệu có đến server không
    const publishedDay = new Date(req.body.PublishedDay);
    const id = req.body.NewsID;
    const tags = req.body.tags || [];

    await editorService.deleteTag(id);

    const changes = {
      PublishedDay: publishedDay,
      CatID: req.body.CatID,
    };
    await editorService.update(id,changes);
    
    try {
    for (const tagName of tags) {
      const tag = await editorService.findExistingTag(tagName);
      console.log("Checking tag:", tagName, "Found:", !!tag);
      if (!tag) {
        const newTag = {
          TagName: tagName,
        };
        try {
          const ret = await editorService.insertTagGetID(newTag);
          console.log("Inserted new tag:", ret);
        } catch (error) {
          console.error("Error inserting new tag:", error);
        }
      }
      const getTagID = await editorService.findTagID(tagName);
      console.log("Tag ID for", tagName, "is:", getTagID?._id);
      const newsTags = {
        TagID: getTagID._id,
        NewsID: id,
      };
      console.log("Adding tag:", newsTags);
      await editorService.addTagNews(newsTags.NewsID, [newsTags.TagID]);
    }
    } catch (error) {
      console.error("Error adding tags:", error);
      return res.status(500).send("Có lỗi xảy ra khi thêm nhãn");
    }
    // Chuyển hướng sau khi xử lý
    res.redirect("/editor/schedule");
  } catch (error) {
    console.error(error);
    res.status(500).send("Có lỗi xảy ra khi xử lý dữ liệu");
  }
});
router.post("/update-status", async function (req, res) {
  const id = req.body.id;
  const status = {
    Status: req.body.status,
  };
  if (!req.body) {
    return res.json({ success: false, message: "Dữ liệu không hợp lệ" });
  }

  try {
    await editorService.update(id, status);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: id });
  }
});
export default router;
