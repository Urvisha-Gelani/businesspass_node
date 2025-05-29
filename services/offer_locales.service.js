import { generateUniqueId } from "../helpers/index.js";
import Offer_Locales from "../models/offer_locales.model.js";

const offerLocalesCreated = async (offerLocales) => {
  const nextLocalesId = await generateUniqueId("offerLocalesId");
  const newOfferLocales = { ...offerLocales, id: nextLocalesId };
  const offerLocalesData = new Offer_Locales(newOfferLocales);
  await offerLocalesData.save();
  return offerLocalesData;
};

export default offerLocalesCreated;
