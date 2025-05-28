import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";
import { photoSchema } from "../helpers/index.js";

const offersSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    workspace_id: { type: Number, required: true },
    location_id: { type: Number, required: true },
    from_time: { type: Date, required: true },
    to_time: { type: Date, required: true },
    offer_type: {
      type: String,
      required: true,
      enm: [
        "gift",
        "discount",
        "trial_access",
        "access_keys",
        "membership",
        "meeting_room",
        "special",
        "keys",
      ],
    },
    pricing_type: {
      type: String,
      required: true,
      default: null,
      enum: ["per_hour", "per_count", "keys"],
    },
    limited_per: { type: String, required: true, default: null },
    person_capacity: { type: Number, required: true, default: null },
    day_count: {
      type: String,
      required: true,
      default: null,
      enum: ["day", "week", "month"],
    },
    custom_day: { type: String, default: null },
    ref_id: { type: Number, required: true },
    remaining_space: { type: Number, default: null },
    photos_order: { type: Array, default: [] },
    language: { type: String, required: true, default: "en" },
    status: {
      type: String,
      required: true,
      enm: [
        "active",
        "deleted",
        "deactivate",
        "draft",
        "expired",
        "limit_reached",
      ],
    },
    photo_urls: {
      type: [photoSchema],
      default: [],
    },
    rate: { type: String, default: null },
    conversion_rate_id: { type: Number, default: null },
    rate_type: {
      type: String,
      default: null,
      enm: ["key_rate_custom", "standard"],
    },
    conversion: { type: String, default: null, enm: ["standard", "custom"] },
    keys: { type: Number, default: null },
    user_time_zone: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
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

setUpdatedAt(offersSchema);
const Offers = mongoose.model("Offers", offersSchema);
export default Offers;
