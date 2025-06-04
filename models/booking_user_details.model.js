import mongoose, { set } from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";

const bookingUserDetailsSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    country_id: { type: Number, default: null },
    offer_id: { type: Number, required: true },
    workspace_id: { type: Number, required: true },
    booking_id: { type: Number, default: null },
    user_booking_number: { type: String, default: null },
    ref_number: { type: String, default: null },
    key_number: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    booking_status: { type: String, default: "in_progress" },
    selected_date: { type: Date, default: null },
    booking_date: { type: Date, default: null },
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
