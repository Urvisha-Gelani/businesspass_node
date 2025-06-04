import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";

const bookingsSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    offer_id: { type: Number, required: true },
    qty: { type: Number, required: true },
    workspace_id: { type: Number, required: true },
    offer_name: { type: String, required: true },
    location_name: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    selected_date: { type: Date, required: true },
    ref_number: { type: String, required: true },
    amount: { type: String, required: true },
    booking_date: { type: Date, default: Date.now },
    traffic: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enm: ["pending", "approved", "cancelled", "in_progress", "confirmed"],
    },
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

setUpdatedAt(bookingsSchema);
const Bookings = mongoose.model("Bookings", bookingsSchema);
export default Bookings;
