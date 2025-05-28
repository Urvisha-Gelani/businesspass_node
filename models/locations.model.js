import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";
import { photoSchema } from "../helpers/index.js";


const LocationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, default: null },
    address: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    description: { type: String, default: null },
    phone_no: { type: String, default: null },
    location_url: { type: String, default: null },
    workspace_id: { type: Number, default: null },
    country_id: { type: Number, required: true },
    country_name: { type: String, default: null },
    city: { type: String, default: null },
    postal_code: { type: String, default: null },
    bucket_name: { type: String, default: null },
    photos_order: { type: Array, default: [] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
    photo_urls: {
      type: [photoSchema],
      default: [],
    },
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
setUpdatedAt(LocationSchema);
const Locations = mongoose.model("Locations", LocationSchema);
export default Locations;
