import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import Counter from "./counter.js";
import crypto from "crypto";
import moment from "moment-timezone";
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

export const generateReferenceId = () => {
  return crypto.randomBytes(6).toString("hex"); // 6 bytes = 12 hex characters
};

export const getRandomChar = (charSet) => {
  const array = new Uint8Array(1);
  crypto.getRandomValues(array); // strong randomness
  return charSet[array[0] % charSet.length];
};
export const generateKeyNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const alphanum = letters + digits;

  const part1 = Array.from({ length: 4 }, () => getRandomChar(alphanum)).join(
    ""
  );
  const part2 = Array.from({ length: 4 }, () => getRandomChar(digits)).join("");
  const part3 = Array.from({ length: 4 }, () => getRandomChar(alphanum)).join(
    ""
  );

  return `${part1}-${part2}-${part3}`;
};

export const generateBookingRefNumber = (offerName, refNumber) => {
  const offerCode = offerName
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 3);
  const refCode = crypto.randomBytes(refNumber).toString("hex");
  return `${offerCode}${refCode}`.toUpperCase();
};

export const formateDate = (date) => {
  return moment(date).tz("Asia/Kolkata").format("DD-MM-YYYY");
};
