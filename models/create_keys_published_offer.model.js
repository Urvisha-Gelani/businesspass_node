import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";

const createKeysPublishedOfferSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    slug: { type: String, default: null },
    user_id: { type: Number, default: null },
    offers_ids: { type: Array, default: [] },
    keys: { type: Boolean, default: false },
    dropdown_ids: { type: Array, default: [] },
    workspace_id: { type: Number, required: true },
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

setUpdatedAt(createKeysPublishedOfferSchema);
const Create_Keys_Published_Offers = mongoose.model(
  "Create_Keys_Published_Offers",
  createKeysPublishedOfferSchema
);

export default Create_Keys_Published_Offers;
