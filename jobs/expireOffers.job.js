import cron from "node-cron";
import Offers from "../models/offer.model.js";
import logger from "../utils/logger.js";

// This runs every hours at 0:00 minutes ("0 * * * *")
// This runs midnight (00:00) ("0 0 * * *")
// This run every second ("* * * * *")
// This runs every 30 minutes (i.e., at :00 and :30 of every hour) ("*/30 * * * *")
const expireOffersJob = cron.schedule("*/30 * * * *", async () => {
  try {
    const now = new Date();

    const result = await Offers.updateMany(
      {
        to_time: { $lt: now },
        status: { $ne: "expired" },
      },
      { $set: { status: "expired" } }
    );
    logger.info(`result ${result.modifiedCount} offer(s) at ${now}`);
    logger.info(`Expired ${result.modifiedCount} offer(s) at ${now}`);
    if (result.modifiedCount > 0) {
      logger.info(`✅ Expired ${result.modifiedCount} offer(s) at ${now}`);
    }
  } catch (err) {
    logger.error("❌ Error expiring offers:", err);
  }
});

export default expireOffersJob;

expireOffersJob.start();
