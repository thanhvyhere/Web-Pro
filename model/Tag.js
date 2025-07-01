import { mongoose } from "../utils/db.js";

const { Schema, model } = mongoose;

const tagSchema = new Schema(
  {
    _id: { type: Number },
    TagName: { type: String, required: true },
  },
  { collection: "Tag", _id: false }
);
const Tag = model("Tag", tagSchema);
export { Tag };
