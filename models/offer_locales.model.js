import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";

const offerLocalesSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    offer_type: {
      type: String,
      required: true,
    },
    pricing_type: {
      type: String,
      required: true,
    },
    day_count: {
      type: String,
      default: null,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    language_code: { type: String, required: true, default: "en" },
    offer_id: { type: Number, required: true },
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
setUpdatedAt(offerLocalesSchema);
const Offer_Locales = mongoose.model("Offer_Locales", offerLocalesSchema);
export default Offer_Locales;