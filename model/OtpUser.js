import { randomUUID } from "crypto";
import { mongoose } from "../utils/db.js";

const { Schema, model } = mongoose;

const otpSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: Number,
    expire_time: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { collection: "OtpUser" }
);

const OtpUser = model("OtpUser", otpSchema);
export default OtpUser;
