import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import Counter from "./counter.js";
import crypto from "crypto";
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

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Generates a 12-character alphanumeric string with 3 parts separated by dashes, like "X8RF-3947-QJGZ".

/*******  0b4c7f1e-e886-4ecf-8686-354f0908d7cc  *******/
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
