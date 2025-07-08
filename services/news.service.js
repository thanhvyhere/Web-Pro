// import db from '../utils/db.js';
import { Category } from "../model/Category.js";
import { News } from "../model/News.js";
import { Tag } from "../model/Tag.js";
import { Comment } from "../model/Comment.js";

export default {
  findAll() {
    return db("news");
  },

  findById(id) {
    return News.findById(id).lean();
  },
  add(entity) {
    return News.create(entity);
  },
  
  async getNextTagID() {
    const last = await Tag.findOne().sort({ _id: -1 }).lean();
    return last ? last._id + 1 : 1;
  },
  async createArticleWithTags(articleData, tagsInput) {
    const article = await News.create(articleData);
    const newsID = article._id;

    let parsedTags = tagsInput;
    if (typeof tagsInput === "string") {
      parsedTags = JSON.parse(tagsInput);
    }

    const tagIDs = [];

    for (const tag of parsedTags) {
      const tagValue = tag.value;
      let existingTag = await Tag.findOne({ TagName: tagValue });

      if (!existingTag) {
        const nextID = await this.getNextTagID();
        existingTag = await Tag.create({ _id: nextID, TagName: tagValue });
      }

      tagIDs.push(existingTag._id);
    }

    await News.findByIdAndUpdate(newsID, { $set: { Tags: tagIDs } });
  },
  findTagByTagName(name) {
    return Tag.findOne({ TagName: name });
  },

  addNewTag(tag) {
    return Tag.create(tag);
  },

  updateNewsTags(newsID, tagIDs) {
    return News.findByIdAndUpdate(newsID, { $set: { Tags: tagIDs } });
  },

  del(id) {
    return db("news").where("NewsID", id).del();
  },

  patch(id, entity) {
    return News.findByIdAndUpdate(id, entity, { new: true });
  },

  findByCatId(catId) {
    return db("news").where("CatID", catId);
  },

  findPageByCatId(catId, limit, offset) {
    return db("news")
      .where({ CatID: catId, Status: 3 })
      .orderBy("Views", "desc")
      .limit(limit)
      .offset(offset);
  },
  countByCatId(catId) {
    return db("news")
      .where({ CatID: catId, Status: 3 })
      .count("* as total")
      .first();
  },
  getAllCategories() {
     return Category.find({}).lean();;
  },
  getCategoriesChild(catId) {
    return Category.find({ parent_id: Number(catId) }).lean();
  },

  getAllCategoriesLimit() {
    return db("categories")
      .select("*") // Chọn tất cả các cột
      .where("parent_id", null) // Điều kiện parent_id = null
      .limit(8); // Giới hạn 8 bản ghi
  },

  async getAllCategoriesWithChildren() {
    // Get all categories in a single query and process in memory
    const allCategories = await Category.find().lean();

    // Create a map for quick lookup
    const categoriesMap = new Map();
    const rootCategories = [];

    // First pass: populate the map and identify root categories
    allCategories.forEach((category) => {
      categoriesMap.set(category._id, { ...category, children: [] });
      if (category.parent_id === null) {
        rootCategories.push(categoriesMap.get(category._id));
      }
    });

    // Second pass: build the hierarchy
    allCategories.forEach((category) => {
      if (
        category.parent_id !== null &&
        categoriesMap.has(category.parent_id)
      ) {
        categoriesMap
          .get(category.parent_id)
          .children.push(categoriesMap.get(category._id));
      }
    });

    return rootCategories;
  },
  getNewsByAuthorStatus(authorName, status) {
    return News.find({
      AuthorName: authorName,
      Status: Number(status),
    }).lean();
  },
  findCatByCatId(catId) {
    return Category.findById(Number(catId)).lean();
  },

  getAllTags() {
     return Tag.find({}, "TagName").lean();
  },

  getIdNewEntity() {
    return db.raw("SELECT LAST_INSERT_ID() as NewsID");
  },
  countByNews() {
    return News.countDocuments().then(total => ({ total }));
  },

  async updateTagsOfNews(newsId, tagIDs) {
    return await News.findByIdAndUpdate(newsId, {
      $set: { Tags: tagIDs }
    });
  },

  async clearTagsOfNews(newsId) {
    return await News.findByIdAndUpdate(newsId, {
      $set: { Tags: [] }
    });
  },
  getIdNewEntity() {
    return db.raw("SELECT LAST_INSERT_ID() as id");
  },

  async getTagByNewsId(newsId) {
    const news = await News.findById(newsId).populate("Tags");
    return news?.Tags || [];
  },

  getAllCommentById(id) {
    return db("comment")
      .join("users", "comment.UserID", "=", "users.id") // Hợp bảng comment với users qua UserID
      .select("comment.*", "users.username") // Chọn tất cả từ comment và thêm username từ users
      .where("comment.NewsID", id) // Điều kiện lọc theo NewsID
      .orderBy("comment.CreatedDate", "desc"); // Sắp xếp theo ngày (CreatedDate) giảm dần
  },

  addComment(entity) {
    return db("comment").insert(entity);
  },
  async countCommentBynewsId(newsId) {
    const total = await Comment.countDocuments({ NewsID: newsId });
    return { total };
  },

  async incrementViewCount(newsId) {
  return await News.updateOne(
    { _id: newsId },          // Tìm theo _id của Mongoose (nếu bạn dùng _id mặc định)
    { $inc: { Views: 1 } }    // Tăng trường Views lên 1
  );
  },

  async getTop3NewsByView() {
    return await News.find({ Status: 3 }) // lọc theo Status
      .sort({ Views: -1 }) // sắp xếp giảm dần
      .limit(5) // giới hạn 5 kết quả
      .populate("CatID")
      .lean()
      .exec();
  },
  async getTop10NewsByDate() {
    return await News.find({ Status: 3 })
      .sort({ PublishedDay: -1 })
      .limit(10)
      .populate("CatID", "CatName")
      .lean()
      .exec();
  },
  async getTop10Cat() {
    const results = await News.aggregate([
      {
        $group: {
          _id: "$CatID", // Group theo CatID
          total_views: { $sum: "$Views" }, // Tính tổng lượt xem
        },
      },
      {
        $lookup: {
          from: "Category", // Tên collection (chữ hoa/thường đúng với Mongo)
          localField: "_id", // _id chính là CatID
          foreignField: "_id", // Category._id
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" }, // Lấy phần tử đầu (vì mỗi CatID là duy nhất)
      { $sort: { total_views: -1 } }, // Giảm dần theo Views
      { $limit: 10 }, // Lấy top 10
      {
        $project: {
          CatID: "$_id",
          CatName: "$categoryInfo.CatName",
          total_views: 1,
          _id: 0,
        },
      },
    ]);

    // Đánh số thứ tự
    return results.map((item, index) => ({
      ...item,
      No: index + 1,
    }));
  },
  getTop10NewsByViews() {
    return News.find({ Status: 3 })
      .populate("CatID") // Populate category details if needed
      .sort({ Views: -1 }) // Descending order by Views
      .limit(10)
      .lean()
      .exec();
  },

  getTop3NewsByRandom() {
    return News.find({ Status: 3 })
      .populate("CatID")
      .sort({ $natural: -1 }) // Hoặc dùng plugin cho random
      .limit(3)
      .lean(); // Lúc này có thể dùng lean()
  },

  getTop3NewsCateByRandom(catId) {
    return News.aggregate([
      {
        $match: {
          CatID: catId,
          Status: 3,
        },
      },
      { $sample: { size: 3 } },
      {
        $lookup: {
          from: "categories",
          localField: "CatID",
          foreignField: "CatID",
          as: "category",
        },
      },
      { $unwind: "$category" },
    ]).exec();
  },
  findPageByTagId(id, limit, offset) {
    return db("news_tags") // Bắt đầu từ bảng news_tags
      .join("news", "news_tags.NewsID", "=", "news.NewsID") // Kết hợp với bảng news qua NewsID
      .join("tag", "news_tags.TagID", "=", "tag.TagID") // Kết hợp với bảng tags qua TagID
      .where({ "tag.TagID": id, "news.Status": 3 })
      .limit(limit)
      .offset(offset);
  },
  countByTagId(tagId) {
    return db("news_tags")
      .join("news", "news.NewsID", "=", "news_tags.NewsID")
      .where({ TagID: tagId, Status: 3 })
      .count("* as total")
      .first();
  },

  searchArticle(query) {
    // Thực hiện một truy vấn duy nhất
    return db("news")
      .where("Title", "like", `%${query}%`)
      .orWhere("Abstract", "like", `%${query}%`)
      .orWhere("Content", "like", `%${query}%`);
  },
  countByPreNews() {
    return db("news")
      .where({ Premium: "1", Status: 3 })
      .count("* as total")
      .first();
  },

  findExpirById(id) {
    return db("premium_accounts");
  },
  updateStatus() {
    return db("news")
      .where("status", 1)
      .andWhere("PublishedDay", "<=", db.fn.now())
      .update({
        status: 3,
      });
  },
};
