import { Tag } from "../model/Tag.js";
import { Category } from "../model/Category.js";
 export async function getNextTagId() {
  const last = await Tag.findOne().sort({ _id: -1 }).lean();
    return last ? last._id + 1 : 1;
}
export async function getNextCategoryId() {
  const last = await Category.findOne().sort({ _id: -1 }).lean();
    return last ? last._id + 1 : 1;
}