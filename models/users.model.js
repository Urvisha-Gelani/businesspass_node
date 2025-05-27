import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimeStamp.middleware.js";
import { hashPasswordMiddleware } from "../middlewares/password.middleware.js";
import bcrypt from "bcryptjs";

const WorkspaceSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    status: String,
    website_url: { type: String, default: null },
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

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, default: null },
    first_name: String,
    last_name: String,
    phone: String,
    email: { type: String, required: true },
    status: { type: String, default: "invited" },
    address: { type: String, default: null },
    key: Number,
    user_type: String,
    country_id: Number,
    position: String,
    nick_name: { type: String, default: null },
    company_name: { type: String, default: null },
    additional_info: { type: String, default: null },
    city_name: { type: String, default: null },
    permissions: { type: [String], default: [] },
    booking_gateway_locked: Boolean,
    key_listing_locked: Boolean,
    payment_options: { type: [String], default: [] },
    preferred_language: String,
    admin: { type: String, default: null },
    country_name: String,
    photo_url: { type: String, default: null },
    space_name: { type: String, default: null },
    workspace: WorkspaceSchema,
    password: { type: String },
    verify_token: { type: String, default: null },
    isSuperAdmin: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
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
UserSchema.pre("save", hashPasswordMiddleware);

UserSchema.methods.matchPassword = function (enteredPassword) {
  console.log(
    enteredPassword,
    "enteredPassword",
    this.password,
    "this.password"
  );
  console.log(bcrypt.compare(enteredPassword, this.password), "bcrypt.compare");
  return bcrypt.compare(enteredPassword, this.password);
};
setUpdatedAt(UserSchema);

const Users = mongoose.model("Users", UserSchema);
export default Users;
