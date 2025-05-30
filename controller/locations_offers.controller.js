import Locations from "../models/locations.model.js";
import Offers from "../models/offer.model.js";
import logger from "../utils/logger.js";

export const locationOffers = async (req, res) => {
  try {
    const { location_id, workspace, user_type } = req.user;
    const { id: workspace_id } = workspace;
    if (!workspace_id) {
      return res.status(422).json({ message: "Invalid workspace ID" });
    }
    let filter = { workspace_id, status: { $ne: "deleted" } };
    let offerFilter = { workspace_id, status: { $ne: "deleted" } };
    if (user_type === "cowork_user") {
      filter.id = location_id;
      offerFilter.location_id = location_id;
    }
    const locations = await Locations.find(filter);
    const offers = await Offers.find(offerFilter);
    if (!locations || !offers) {
      return res.status(404).json({ message: "Location offer not found" });
    }
    console.log("locations", locations);
    const locationData = locations.map((location) => {
      const { id, name, status } = location.toObject();
      return { id, name, status };
    });

    const offerData = offers.map((offer) => {
      const { id, name, status, ref_id, pricing_type } = offer.toObject();
      return { id, name, status, ref_id, pricing_type };
    });
    res.status(200).json({ locations: locationData, offers: offerData });
  } catch (error) {
    logger.error(`Error getting location offers: ${error}`);
    res.status(500).json({ error: "Error getting location offers" });
  }
};

export const conversionRates = async (req, res) => {
  try {
    const response = {
      id: 1,
      rate: "10.0",
      from: new Date().toISOString(),
      to: new Date().toISOString(),
    };
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error getting conversion rates: ${error}`);
    res.status(500).json({ error: "Error getting conversion rates" });
  }
};
