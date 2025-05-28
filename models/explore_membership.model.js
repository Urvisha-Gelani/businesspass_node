import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";

const exploreMembershipSchema = new mongoose.Schema(
  {
    id: Number,
    name: { type: String, required: true },
    email: { type: String, required: true },
    explore_type: { type: String, default: null },
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

setUpdatedAt(exploreMembershipSchema);
const Explore_membership = mongoose.model(
  "Explore_membership",
  exploreMembershipSchema
);
export default Explore_membership;
