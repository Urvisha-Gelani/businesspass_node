import cron from "node-cron";
import Offers from "../models/offer.model.js";
import logger from "../utils/logger.js";

// This runs every day at 00:00 (midnight)
const expireOffersJob = cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    const result = await Offers.updateMany(
      {
        to_time: { $lt: now },
        status: { $ne: "expired" },
      },
      { $set: { status: "expired" } }
    );
    logger.info(`Expired ${result.modifiedCount} offer(s) at ${now}`);
    if (result.modifiedCount > 0) {
      logger.info(`✅ Expired ${result.modifiedCount} offer(s) at ${now}`);
    }
  } catch (err) {
    logger.error("❌ Error expiring offers:", err);
  }
});

export default expireOffersJob;
