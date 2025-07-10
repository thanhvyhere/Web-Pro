// import db from '../utils/db.js'
import {News} from '../model/News.js';
import { Category } from '../model/Category.js';
import { Tag } from '../model/Tag.js';
import { Status } from '../model/Status.js';
import { getNextTagId } from "../middleware/function.mdw.js";
export default
{
    async findAll() {
        const statusOrder = [
           "Đang chờ",
            "Đã chỉnh sửa",
            "Đã duyệt",
            "Đã nhận xét",
            "Đã từ chối",
            "Đã đăng",
            "Đã xóa",
            ];

        return News.aggregate([
        {
            $lookup: {
            from: "Status",
            localField: "Status",
            foreignField: "_id",
            as: "statusInfo"
            }
        },
        { $unwind: "$statusInfo" },
        {
            $addFields: {
            StatusName: "$statusInfo.StatusName",
            orderIndex: { $indexOfArray: [statusOrder, "$statusInfo.StatusName"] }
            }
        },
        { $sort: { orderIndex: 1 } },
        {
            $project: {
            statusInfo: 0,
            orderIndex: 0
            }
        }
        ]);
    },

    findReviewed() {
  return News.aggregate([
    {
      $lookup: {
        from: "Status",
        localField: "Status",
        foreignField: "_id",
        as: "statusInfo"
      }
    },
    { $unwind: "$statusInfo" },
    { $match: { "statusInfo.StatusName": "Đã nhận xét" } },
    {
      $addFields: {
        StatusName: "$statusInfo.StatusName"
      }
    },
    {
      $project: {
        statusInfo: 0
      }
    }
  ]);
    },


    findRejected() {
  return News.aggregate([
    {
      $lookup: {
        from: "Status",
        localField: "Status",
        foreignField: "_id",
        as: "statusInfo"
      }
    },
    { $unwind: "$statusInfo" },
    { $match: { "statusInfo.StatusName": "Đã từ chối" } },
    {
      $addFields: {
        StatusName: "$statusInfo.StatusName"
      }
    },
    {
      $project: {
        statusInfo: 0
      }
    }
  ]);
    },
    findApproved() {
  return News.aggregate([
  // Join bảng Status
  {
    $lookup: {
      from: "Status",
      localField: "Status",
      foreignField: "_id",
      as: "statusInfo"
    }
  },
  { $unwind: "$statusInfo" },
  { $match: { "statusInfo.StatusName": "Đã duyệt" } },

  // Join bảng Category
  {
    $lookup: {
      from: "Category",
      localField: "CatID",
      foreignField: "_id",
      as: "categoryInfo"
    }
  },
  { $unwind: "$categoryInfo" },
  {
    $lookup: {
      from: "Tag",
      localField: "Tags",
      foreignField: "_id",
      as: "tagInfo"
    }
  },
  {
    $lookup: {
      from: "Category",
      localField: "categoryInfo.parent_id",
      foreignField: "_id",
      as: "parentCatInfo"
    }
  },
  { $unwind: { path: "$parentCatInfo", preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      StatusName: "$statusInfo.StatusName",
      CategoryName: "$categoryInfo.CatName",
      ParentCategoryName: "$parentCatInfo.CatName",
      TagNames: {
        $map: {
          input: "$tagInfo",
          as: "tag",
          in: "$$tag.TagName"
        }
      }
    }
  },

  // Ẩn các trường trung gian
  {
    $project: {
      statusInfo: 0,
      categoryInfo: 0,
      tagInfo: 0,
      parentCatInfo: 0
    }
  }
  ]);
    },

    async findParentCat() {
        return Category.find({ parent_id: null }).lean();
    },

    async findChildCat(parentID) {
        return Category.find({ parent_id: parentID }).lean();
    },

    async update(id, entity) {
        return News.findByIdAndUpdate(id, entity);
    },

    async findANews(id) {
        const news = await News.findById(id)
        .populate({ path: "CatID", model: Category })
        .populate({ path: "Status", model: Status });
        return news;
    },

    async findNewsByID(id) {
        return News.findById(id).populate({ path: "Status", model: Status }).lean();
    },

    async findTags(newsID) {
        const news = await News.findById(newsID);
        if (!news || !news.Tags) return [];
        const tags = await Tag.find({ _id: { $in: news.Tags } });
        return tags.map((t) => t.TagName);
    },

    async deleteTag(newsID) {
        return News.findByIdAndUpdate(newsID, { $set: { Tags: [] } });
    },

    async findExistingTag(tagName) {
        return Tag.findOne({ TagName: tagName }).lean();
    },

    async insertTagGetID(entity) {
        const newTag = new Tag({
              _id: await getNextTagId(),
              ...entity,
            });
        
        await newTag.save();
        return newTag;
    },

    async findTagID(tagName) {
        return Tag.findOne({ TagName: tagName }).lean();
    },

    async addTagNews(newsID, tagIDs) {
        return News.findByIdAndUpdate(newsID, { $set: { Tags: tagIDs } });
    },
    async findPageById(limit, offset) {
        const statusOrder = [
            "Đang chờ",
            "Đã chỉnh sửa",
            "Đã duyệt",
            "Đã nhận xét",
            "Đã từ chối",
            "Đã đăng",
            "Đã xóa",
        ];

        const pipeline = [
            {
            $lookup: {
                from: "Status", // tên collection
                localField: "Status", // trường trong News
                foreignField: "_id", // trường trong Status
                as: "statusInfo",
            },
            },
            { $unwind: "$statusInfo" },
            {
            $addFields: {
                StatusName: "$statusInfo.StatusNameName",
                orderIndex: {
                $indexOfArray: [statusOrder, "$statusInfo.StatusNameName"],
                },
            },
            },
            { $sort: { orderIndex: 1 } },
            { $skip: offset },
            { $limit: limit },
            {
            $project: {
                statusInfo: 0, // ẩn trường thừa
                orderIndex: 0,
            },
            },
        ];

        return await News.aggregate(pipeline);
        },
    async countByNews()
    {
        const total = await News.countDocuments();
        return total;
    }
}