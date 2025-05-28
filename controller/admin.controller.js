import Locations from "../models/locations.model.js";
import Users from "../models/users.model.js";
import locationCreated from "../services/locations.services.js";

export const getUserLocations = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const { id } = req.params;
    console.log("id", id);
    if (!id) {
      return res.status(422).json({ message: "Invalid request data" });
    }
    const user = await Users.findOne({ id });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { workspace } = user;
    console.log("workspace", workspace);
    const { id: workspace_id } = workspace;
    const filter = { workspace_id: workspace_id };

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
    res.status(200).json({ locations });
  } catch (error) {
    console.log(`Error getting user locations: ${error}`);
    res.status(500).json({ error: "Error getting user locations" });
  }
};

export const createAdminLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findOne({ id });
    const { workspace } = user;
    const { id: workspace_id } = workspace;
    const { location } = req.body;
    const newLocationData = {
      ...location,
      workspace_id: workspace_id,
    };

    const newLocation = await locationCreated(newLocationData);
    console.log("newLocation", newLocation);
    if (!newLocation) {
      return res.status(400).json({ message: "Location creation failed" });
    }

    res.status(200).json(newLocation);
  } catch (error) {
    console.log(`Error creating admin location: ${error}`);
    res.status(500).json({ error: "Error creating admin location" });
  }
};
