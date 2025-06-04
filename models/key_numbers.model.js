import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";

const keyNumbersSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    key_number: { type: String, required: true },
    country_id: { type: Number, default: null },
    status: { type: String, required: true },
    issued_by: { type: String, required: true },
    price: { type: String, required: true },
    offer_name: { type: String, required: true },
    offer_id: { type: Number, required: true },
    workspace_id: { type: Number, required: true },
    keys: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    booking_user_detail_id: { type: Number, required: true },
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

setUpdatedAt(keyNumbersSchema);
const KeyNumbers = mongoose.model("KeyNumbers", keyNumbersSchema);
export default KeyNumbers;
