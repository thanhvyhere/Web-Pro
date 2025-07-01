import { mongoose } from "../utils/db.js";
const { Schema, model, Types } = mongoose;

const featureSchema = new Schema(
  {
    _id: Number,
    FeatureName: { type: String, required: true },
    PathName: { type: String, required: true },
    RoleID: {
      type: Number,
      ref: "Role",
      required: true,
    },
    Icon: { type: String, default: null },
  },
  { _id: false, collection: "Feature" }
);

const Feature = model("Feature", featureSchema);

export default Feature;
