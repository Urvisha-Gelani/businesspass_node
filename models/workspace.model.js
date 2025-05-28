import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";
const WorkspaceSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    status: String,
    website_url: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    user_id: { type: Number, default: null },
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

setUpdatedAt(WorkspaceSchema);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);
export default Workspace;
