import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import Counter from "./counter.js";
export const generateUniqueId = async (name) => {
  const result = await Counter.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  if (!result) {
    throw new Error("Failed to generate user ID");
  }
  logger.info(`Next sequence value: ${result}`);
  return result.seq;
};

export const photoSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    url: { type: String, required: true },
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

export const generateSlug = () => {
  return uuidv4();
};
