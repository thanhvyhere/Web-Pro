import { mongoose } from "../utils/db.js";

const { Schema, model } = mongoose;

const statusSchema = new Schema(
  {
    _id: Number,
    StatusName: { type: String, required: true },
  },
  { _id: false, collection: "Status" }
);
const Status = model("Status", statusSchema);
export { Status };
