import express from "express";
import {
  CreatePublishOffersSlug,
  getPublishedOffers,
  getPublishedOffersUrls,
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
keyListingRouter.post(
  "/published_offers/create_or_update",
  CreatePublishOffersSlug
);

keyListingRouter.get("/published_offers", getPublishedOffers);
keyListingRouter.get("/published_offers/:ref_id/urls", getPublishedOffersUrls);

export default keyListingRouter;
