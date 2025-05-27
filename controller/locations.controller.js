import Locations from "../models/locations.model.js";
import locationCreated from "../services/locations.services.js";
import { generateMockPresignedUrls } from "../services/photo.services.js";
import logger from "../utils/logger.js";
import path from "path";
const uploadDir = path.join(process.cwd(), "uploads");
export const createLocations = async (req, res) => {
  try {
    const { location } = req.body;
    console.log(req.user, "req.user+++++++++++++++++++++++++++");
    const workspaceId = req.user.workspace.id;

    const newLocationData = {
      ...location,
      workspace_id: workspaceId,
    };

    const newLocation = await locationCreated(newLocationData);
    console.log("newLocation", newLocation);
    if (!newLocation) {
      return res.status(400).json({ message: "Location creation failed" });
    }

    res.status(200).json(newLocation);
  } catch (error) {
    logger.error(`Error creating location: ${error}`);
    res.status(500).json({ error: "Error creating location" });
  }
};

export const generatePresignedUrls = async (req, res) => {
  const locationId = req.params.id;
  const { photos } = req.body.location;

  const location = await Locations.findOne({ id: Number(locationId) });
  if (!location) return res.status(404).json({ error: "Location not found" });

  const urls = generateMockPresignedUrls(photos, location.bucket_name);
  res.json({ presigned_urls: urls });
};

export const getLocations = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const workspaceId = req.user.workspace.id;
    const filter = { workspace_id: workspaceId };

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.address) {
      filter.address = { $regex: req.query.address, $options: "i" };
    }

    if (req.query.phone_no) {
      filter.phone_no = { $regex: req.query.phone_no, $options: "i" };
    }

    if (req.query.country_name) {
      filter.country_name = { $regex: req.query.country_name, $options: "i" };
    }
    if (req.query.status) {
      filter.status = { $regex: req.query.status, $options: "i" };
    }

    const totalLocations = await Locations.countDocuments(filter);
    if (totalLocations === 0) {
      return res.status(200).json([]);
    }

    const locations = await Locations.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.set({
      Total: totalLocations,
      "Total-Pages": Math.ceil(totalLocations / limit),
      "Current-Page": page,
      "Per-Page": limit,
    });
    res.status(200).json({ locations });
  } catch (error) {
    logger.error(`Error getting locations: ${error}`);
    res.status(500).json({ error: "Error getting locations" });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(422).json({ message: "Invalid request data" });
    }
    const deletedLocation = await Locations.findOneAndDelete({ id });
    if (!deletedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting location: ${error}`);
    res.status(500).json({ error: "Error deleting location" });
  }
};
