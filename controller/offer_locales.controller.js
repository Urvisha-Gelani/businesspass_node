import Offer_Locales from "../models/offer_locales.model.js";
import offerLocalesCreated from "../services/offer_locales.service.js";
import logger from "../utils/logger.js";

export const CreateOfferLocales = async (req, res) => {
  try {
    const { offer_id } = req.params;
    const { offer_locale } = req.body;
    const newOfferLocales = await offerLocalesCreated({
      offer_id,
      ...offer_locale,
    });
    if (!newOfferLocales) {
      return res.status(400).json({ message: "Offer creation failed" });
    }
    res.status(200).json(newOfferLocales);
  } catch (error) {
    logger.error(`Error getting conversion rates: ${error}`);
    res.status(500).json({ error: "Error getting conversion rates" });
  }
};

export const updateOfferLocales = async (req, res) => {
  try {
    const { id } = req.params;
    const { offer_locale } = req.body;
    const newOfferLocales = await Offer_Locales.findOneAndUpdate(
      { id },
      offer_locale,
      { new: true }
    );
    if (!newOfferLocales) {
      return res.status(400).json({ message: "Offer creation failed" });
    }
    res.status(200).json(newOfferLocales);
  } catch (error) {
    logger.error(`Error getting conversion rates: ${error}`);
    res.status(500).json({ error: "Error getting conversion rates" });
  }
};
