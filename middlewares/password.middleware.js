import bcrypt from "bcryptjs";

export const hashPasswordMiddleware = async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    console.log("Salt generated:", salt);
    console.log("Password before hashing:", this.password);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
};
