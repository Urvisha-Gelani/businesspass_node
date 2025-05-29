import express from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import {
  createOffer,
  deleteOffer,
  getOffers,
  updateOffer,
} from "../controller/offers.controller.js";
import { generatePresignedUrls } from "../controller/locations.controller.js";
const offersRouter = express.Router();
offersRouter.use(authenticateToken);

offersRouter.post("/locations/:id/offers", createOffer);
offersRouter.get("/offers", getOffers);
offersRouter.delete("/locations/:location_id/offers/:id", deleteOffer);
offersRouter.patch("/locations/:location_id/offers/:id", updateOffer);
offersRouter.post(
  "/locations/:id/offers/:offer_id/generate_presigned_url",
  generatePresignedUrls
);
export default offersRouter;
