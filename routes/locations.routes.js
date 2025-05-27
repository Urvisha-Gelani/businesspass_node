import express from "express";
import {
  createLocations,
  deleteLocation,
  generatePresignedUrls,
  getLocations,
} from "../controller/locations.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
import { locationOffers } from "../controller/locations_offers.controller.js";

const locationRouter = express.Router();
locationRouter.use(authenticateToken);

locationRouter.post("/locations", createLocations);
locationRouter.get("/locations", getLocations);
locationRouter.delete("/locations/:id", deleteLocation);
locationRouter.post(
  "/locations/:id/generate_presigned_url",
  generatePresignedUrls
);
locationRouter.get("/locations/locations_offers", locationOffers);

export default locationRouter;
