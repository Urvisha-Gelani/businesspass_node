import express from "express";
import {
  CreatePublishOffersSlug,
  OffersFindByDropdown,
} from "../controller/key_listing.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const keyListingRouter = express.Router();
keyListingRouter.use(authenticateToken);

keyListingRouter.post(
  "/published_offers/find_by_dropdown",
  OffersFindByDropdown
);

keyListingRouter.post(
  "/published_offers/create_keys_published_offer",
  CreatePublishOffersSlug
);

export default keyListingRouter;
