import { generateUniqueId } from "../helpers/index.js";
import Offers from "../models/offer.model.js";
import offerLocalesCreated from "./offer_locales.service.js";

const offerCreated = async (offerData) => {
  const { location_id, offer, workspace_id } = offerData;

  const offerId = await generateUniqueId("offerId");
  const referenceId = Math.floor(100000 + Math.random() * 900000);

  const {
    limited_per,
    rate,
    price,
    pricing_type,
    person_capacity,
    offer_locales_attributes = [],
    ...restOfferFields
  } = offer;

  // Create offer_locales
  const createdLocale = await offerLocalesCreated({
    offer_id: offerId,
    ...offer_locales_attributes[0],
  });

  // Create new offer
  const newOffer = new Offers({
    id: offerId,
    workspace_id,
    location_id,
    ref_id: referenceId,
    limited_per,
    rate,
    price,
    pricing_type,
    person_capacity,
    remaining_space:
      pricing_type === "per_hour" ? person_capacity : Number(limited_per),
    keys: Math.round(Number(price) / Number(rate)),
    ...restOfferFields,
  });

  await newOffer.save();

  // Extract only the fields we want to return (excluding _id, created_at, updated_at)
  const {
    _id: _oId,
    created_at: _oCreated,
    updated_at: _oUpdated,
    ...cleanedOffer
  } = newOffer.toObject();

  const {
    _id: _lId,
    created_at: _lCreated,
    updated_at: _lUpdated,
    ...cleanedLocaleData
  } = createdLocale.toObject?.() || createdLocale;

  return {
    ...cleanedOffer,
    offer_locales: [cleanedLocaleData],
  };
};

export default offerCreated;
