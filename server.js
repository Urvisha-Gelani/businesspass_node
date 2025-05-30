import app from "./app.js";
import connectDB from "./config/db.config.js";
import expireOffersJob from "./jobs/expireOffers.job.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
import os from "os";

dotenv.config();
expireOffersJob.start();
const interfaces = os.networkInterfaces();
logger.info(`interfaces: ${interfaces}`);
export const getLocalIP = () => {
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
};

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

const localIP = getLocalIP() || "localhost";
logger.info(`Local IP:", ${localIP}`);
export const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, localIP, () => {
    logger.info(`🚀  Server running at http://${localIP}:${PORT}`);
  });
});
