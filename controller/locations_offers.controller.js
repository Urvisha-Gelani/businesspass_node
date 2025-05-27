import Locations from "../models/locations.model.js";
import logger from "../utils/logger.js";

export const locationOffers = async (req, res) => {
  try {
    const workspaceId = req.user.workspace.id;
    if (!workspaceId) {
      return res.status(422).json({ message: "Invalid workspace ID" });
    }
    const locations = await Locations.find({ workspace_id: workspaceId });
    if (!locations) {
      return res.status(404).json({ message: "Location not found" });
    }
    console.log("locations", locations);
    const locationData = locations.map((location) => {
      const { id, name, workspace_id } = location.toObject();
      return { id, name, workspace_id };
    });
    res.status(200).json({ locations: locationData });
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
