import Users from "../models/users.model.js";
import coWorkUserCreated from "../services/cowork_user.service.js";
import logger from "../utils/logger.js";

export const createCoWorkUser = async (req, res) => {
  try {
    const { cowork_user } = req.body;
    const { email: userEmail } = cowork_user;
    const user = req.user;
    console.log("user", user);
    const existingUser = await Users.findOne({
      email: userEmail,
    });
    logger.info(`existingUser: ${existingUser}`);
    if (existingUser) {
      logger.error(`createUser: Email already exists`);
      return res.status(422).json({ email: ["has already been taken"] });
    }
    const coWorkUser = await coWorkUserCreated({
      cowork_user,
      requestedUser: user,
    });

    if (!coWorkUser) {
      return res.status(400).json({ message: "CoWork User creation failed" });
    }
    const {
      id,
      name,
      first_name,
      last_name,
      email,
      location_name,
      location_id,
      phone,
      country_id,
      permissions,
      status,
      user_type,
      country_name,
      verify_token: token,
    } = coWorkUser;
    res.status(201).json({
      id,
      name,
      first_name,
      last_name,
      email,
      location_name,
      location_id,
      phone,
      country_id,
      permissions,
      status,
      user_type,
      token,
      country_name,
    });
  } catch (error) {
    logger.error(`Error creating cowork user: ${error}`);
    res.status(500).json({ error: "Error creating cowork user" });
  }
};

export const getAllCoWorkUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const { workspace } = req.user;
    console.log("req.user", req.user);
    const { id: workspace_id } = workspace;
    const filter = {
      "workspace.id": workspace_id,
      user_type: "cowork_user",
    };

    if (req.query.name) {
      filter.$or = [
        { first_name: { $regex: req.query.name, $options: "i" } },
        { last_name: { $regex: req.query.name, $options: "i" } },
      ];
    }

    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" };
    }

    if (req.query.location_name) {
      filter.location_name = { $regex: req.query.location_name, $options: "i" };
    }

    if (req.query.phone) {
      filter.phone = { $regex: req.query.phone, $options: "i" };
    }

    if (req.query.status) {
      filter.status = { $regex: req.query.status, $options: "i" };
    }

    if (req.query.permissions) {
      filter.permissions = { $regex: req.query.permissions, $options: "i" };
    }

    console.log("filter", filter);
    const totalUsers = await Users.countDocuments(filter);

    if (totalUsers === 0) {
      return res.status(200).json([]);
    }

    const users = await Users.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    const response = users.map((coworkUser) => {
      const {
        id,
        name,
        first_name,
        last_name,
        email,
        location_name,
        location_id,
        phone,
        country_id,
        permissions,
        status,
        user_type,
        country_name,
      } = coworkUser.toObject();
      return {
        id,
        name,
        first_name,
        last_name,
        email,
        location_name,
        location_id,
        phone,
        country_id,
        permissions,
        status,
        user_type,
        country_name,
      };
    });

    res.set({
      Total: totalUsers,
      "Total-Pages": Math.ceil(totalUsers / limit),
      "Current-Page": page,
      "Per-Page": limit,
    });
    res.status(200).json({ cowork_users: response });
  } catch {
    logger.error(`Error getting all cowork users: ${error}`);
    res.status(500).json({ error: "Error getting all cowork users" });
  }
};

export const updateCoWorkUser = async (req, res) => {
  try {
    const { id: user_id } = req.params;
    const { cowork_user } = req.body;
    if (!user_id || !cowork_user) {
      return res.status(422).json({ error: "Invalid request data" });
    }
    const updatedUser = await Users.findOneAndUpdate(
      { id: user_id },
      { ...cowork_user },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "CoWork User not found" });
    }
    const {
      id,
      name,
      first_name,
      last_name,
      email,
      location_name,
      location_id,
      phone,
      country_id,
      permissions,
      status,
      user_type,
      country_name,
    } = updatedUser;
    res.status(200).json({
      id,
      name,
      first_name,
      last_name,
      email,
      location_name,
      location_id,
      phone,
      country_id,
      permissions,
      status,
      user_type,
      country_name,
    });
  } catch (error) {
    logger.error(`Error updating cowork user: ${error}`);
    res.status(500).json({ error: "Error updating cowork user" });
  }
};

export const deleteCoWorkUser = async (req, res) => {
  try {
    const { id: user_id } = req.params;
    if (!user_id) {
      return res.status(422).json({ error: "Invalid request data" });
    }
    const deletedUser = await Users.findOneAndUpdate(
      { id: user_id },
      { status: "deleted" }
    );
    if (!deletedUser) {
      return res.status(404).json({ message: "CoWork User not found" });
    }
    res.status(200).json({ message: "CoWork User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting cowork user: ${error}`);
    res.status(500).json({ error: "Error deleting cowork user" });
  }
};
