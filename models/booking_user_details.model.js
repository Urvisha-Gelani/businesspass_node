import mongoose, { set } from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";

const bookingUserDetailsSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    offer_id: { type: Number, required: true },
    workspace_id: { type: Number, required: true },
    key_number: { type: String, required: true },
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
setUpdatedAt(bookingUserDetailsSchema);
const BookingUserDetails = mongoose.model(
  "BookingUserDetails",
  bookingUserDetailsSchema
);
export default BookingUserDetails;
