import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import Users from "../models/users.model.js";
dotenv.config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  logger.info(`Authorization header: ${authHeader}`);
  logger.info(`Token extracted: ${token}`);
  if (!token) {
    logger.error("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`Decoded token: ${decoded.id}`);
    const user = await Users.findOne({ id: decoded.id });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach full user object to req.user
    req.user = user;
    next();
  } catch (err) {
    logger.error(`Token verification error: ${err}`);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default authenticateToken;
