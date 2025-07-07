import { mongoose } from "../utils/db.js";
const { Schema, model, Types } = mongoose;

const featureSchema = new Schema(
  {
    _id: Number,
    FeatureName: { type: String, required: true },
    PathName: { type: String, required: true },
    Role: {
      type: String,
      required: true,
      enum: [ "subscriber", "writer", "editor", "administrator"],
    },
    Icon: { type: String, default: null },
  },
  { _id: false, collection: "Feature" }
);

const Feature = model("Feature", featureSchema);

export default Feature;
