import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";

const coWorkUserSchema = new mongoose.Schema(
  {
    id: Number,
    name: { type: String, default: null },
    first_name: { type: String, default: null, required: true },
    last_name: { type: String, default: null, required: true },
    phone: { type: String, default: null, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "invited",
        "activated",
        "deleted",
        "accepted",
        "registered",
        "closed",
        "deactivated",
      ],
      default: "invited",
    },
    user_type: { type: String, default: "cowork_user" },
    country_id: { type: Number, required: true },
    permissions: { type: Array, default: [] },
    location_id: { type: Number, required: true },
    location_name: { type: String, default: null },
    token: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by_id: { type: Number, default: null },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
  }
);

setUpdatedAt(coWorkUserSchema);
const CoWorkUser = mongoose.model("CoWorkUser", coWorkUserSchema);
export default CoWorkUser;
