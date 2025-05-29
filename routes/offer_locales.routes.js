import express from "express";
import {
  CreateOfferLocales,
  updateOfferLocales,
} from "../controller/offer_locales.controller.js";
const offerLocalesRouter = express.Router();

offerLocalesRouter.post(
  "/locations/:location_id/offers/:offer_id/locales",
  CreateOfferLocales
);
offerLocalesRouter.patch(
  "/locations/:location_id/offers/:offer_id/locales/:id",
  updateOfferLocales
);

export default offerLocalesRouter;
