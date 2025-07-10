// import db from '../utils/db.js';
import bcrypt from 'bcryptjs';
import {Tag}from '../model/Tag.js';
import { Category } from '../model/Category.js';
import User from '../model/User.js';
import { News } from '../model/News.js';
import {Status} from '../model/Status.js';
import Role from '../model/Role.js';
import {getNextTagId} from "../middleware/function.mdw.js";
import { getNextCategoryId } from "../middleware/function.mdw.js";

export default {
  async findAll() {
  return await Category.find().lean();
  },

  findCategoryById(categoryId) {
    const id = Number(categoryId);
    return Category.findById(id).lean();
  },

  // Thêm chuyên mục mới
  async add({ CatName, parent_id }) {
  const newCategory = new Category({
    _id: await this.getNextCategoryId(), 
    CatName,
    parent_id: parent_id ? Number(parent_id) : null,
  });

  await newCategory.save();
  },
  // Cập nhật chuyên mục
  async update(id, category) {
    const updated = await Category.updateOne(
      { _id: Number(id) },
      {
        CatName: category.CatName,
        parent_id: category.parent_id || null,
      }
    );

    return updated.modifiedCount;
  },

  async updateCategoryParent(categoryIds, newParentId) {
    if (newParentId === null) {
    throw new Error("Không thể cập nhật parent_id thành null.");
    }

    const parent = await Category.findById(newParentId);
    if (!parent) {
      throw new Error("Danh mục cha không tồn tại.");
    }

    const result = await Category.updateMany(
      { _id: { $in: categoryIds.map(Number) } },
      { parent_id: Number(newParentId) }
    );

    return result.modifiedCount;
  },

  // Delete selected categories
  async deleteCategories(categoryIds) {
    const ids = categoryIds.map(Number); // Đảm bảo các ID là số

    const result = await Category.deleteMany({ _id: { $in: ids } });
    return result.deletedCount;
  },

  // Tags methods
  getAllTags() {
    return Tag.find().lean();
  },
  getAllRoles()
  {
    return Role.find().lean();
  },
  async getTagsWithPagination(offset, limit, searchQuery = '') {
  const filter = {};

    if (searchQuery) {
      filter.TagName = { $regex: searchQuery, $options: 'i' }; 
    }

    const [tags, total] = await Promise.all([
      Tag.find(filter)
        .skip(offset)
        .limit(limit)
        .lean(),
      Tag.countDocuments(filter),
    ]);

    return { tags, total };
  },

  async getTagById(tagId) {
      return await Tag.findById(tagId).lean();
  },

  async addTag(tag) {
    const newTag = new Tag({
      _id: await this.getNextTagId(),
      TagName: tag.TagName,
    });

  await newTag.save();
  },
  async updateTag(tagId, updatedTag) {
    const id = Number(tagId); // đảm bảo kiểu là số
    return await Tag.findByIdAndUpdate(id, updatedTag, { new: true, lean: true });
  },

  async deleteTag(tagId) {
    const id = Number(tagId); // đảm bảo kiểu là số
    return await Tag.findByIdAndDelete(id);
  },
  // Lấy thông tin người dùng theo ID
  async findByIdUsers(id) {
    return await User.findById(id).lean(); // .lean() để trả về plain JS object nếu cần
  },

  async addUsers(user) {
    const saltRounds = 10;

    try {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      const newUser = new User({
        username: user.username,
        password: hashedPassword,
        name: user.name || null,
        email: user.email || null,
        dob: user.dob || null,
        role: user.role || "guest", // vì Mongoose dùng 'role' thay vì 'permission'
      });

      const savedUser = await newUser.save();
      return savedUser._id; // tương đương returning 'id'
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

    // Cập nhật thông tin người dùng
    async updateUsers(id, updatedUser) {
    const updatedData = {
      username: updatedUser.username,
      name: updatedUser.name || null,
      email: updatedUser.email || null,
      dob: updatedUser.dob || null,
      role: updatedUser.role || "guest", // tương ứng với "permission"
    };

    // Nếu có password mới thì hash lại
    if (updatedUser.password) {
      const bcrypt = await import("bcrypt");
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(updatedUser.password, saltRounds);
    }

    const result = await User.updateOne({ _id: id }, updatedData);
    return result.modifiedCount; // tương đương số dòng bị ảnh hưởng
  },

  // Xóa người dùng
  async deleteUsers(id) {
    const result = await User.deleteOne({ _id: id });
    return result.deletedCount;
  },


  // Lấy danh sách người dùng có phân trang và tên quyền (permission)
  async findAllWithPaginationUsers(offset, limit) {
    const [users, total] = await Promise.all([
      User.find({})
        .select("username name email dob NoOfFollower NoOfFollowing role") // tương đương với select
        .skip(offset)
        .limit(limit)
        .lean(),

      User.countDocuments(), // đếm tổng số user
    ]);

    return { users, total };
  },
  // Lấy danh sách chuyên mục với phân trang và tìm kiếm
  async findAllWithPagination(offset, limit, searchQuery = '') {
    const filter = {};

      if (searchQuery) {
        filter.CatName = { $regex: searchQuery, $options: 'i' };
      }

      const [categories, total] = await Promise.all([
        Category.find(filter)
          .skip(offset)
          .limit(limit)
          .populate({
            path: 'parent_id',
            select: 'CatName', // chỉ lấy CatName từ parent
          })
          .lean(),
        Category.countDocuments(filter),
      ]);

      // Gắn parent_name như SQL logic
      const formatted = categories.map(cat => ({
        CatID: cat._id,
        CatName: cat.CatName,
        parent_name: cat.parent_id?.CatName || '-', // nếu không có parent -> "-"
      }));

      return { categories: formatted, total };
  },  

  async findAllWithPaginationArticles(offset, limit) {
    const [articles, total] = await Promise.all([
      News.find({})
        .select("Title CreatedDate AuthorName Status Views Premium") // chỉ chọn các trường cần
        .skip(offset)
        .limit(limit)
        .lean(),

      News.countDocuments()
    ]);

    // Nếu bạn muốn đổi _id thành NewsID để giống SQL:
    const formattedArticles = articles.map(article => ({
      NewsID: article._id,
      Title: article.Title,
      CreatedDate: article.CreatedDate,
      AuthorName: article.AuthorName,
      Status: article.Status,
      Views: article.Views,
      Premium: article.Premium
    }));

    return { articles: formattedArticles, total };
  },

  // Lấy thông tin chi tiết bài viết
  async findByIdArticles(newsID) {
  const article = await News.findById(newsID)
    .populate("CatID", "CatName")           // Nếu cần tên chuyên mục
    .populate("Status", "status")       // Nếu cần tên trạng thái
    .populate("Tags", "TagName")            // Nếu cần tên tag
    .lean();

  return article;
},
  // Cập nhật trạng thái Premium của bài viết
  async updatePremium(newsId, premium) {
  const isPremium = premium === true || premium === 'true';

  return await News.findByIdAndUpdate(
    newsId,
    { Premium: isPremium },
    { new: true } // trả về bản ghi đã cập nhật
  );
}
};