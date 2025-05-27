import { Console } from "console";
import Users from "../models/users.model.js";
import userCreated from "../services/users.services.js";
import logger from "../utils/logger.js";
import { sendVerificationEmail } from "../services/email.services.js";

export const createUser = async (req, res) => {
  try {
    console.log("req.body+++++++++++++++++++++++++++", req.body);
    const { user } = req.body;
    const payloadUser = await userCreated(user);
    if (!user) {
      return res.status(400).json({ message: "User creation failed" });
    }
    const { password, verify_token, workspace, ...safeUser } =
      payloadUser.toObject();
    safeUser.isSuperAdmin = user.user_type === "super_admin";

    res.status(201).json({ user: { ...safeUser, workspace: null } });
  } catch (error) {
    logger.error(`Error creating user: ${error}`);
    res.status(500).json({ error: "Error creating user" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    // Extract pagination parameters from query with default values
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Count total documents
    const totalUsers = await Users.countDocuments();

    if (totalUsers === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Fetch users with pagination
    const users = await Users.find().skip(skip).limit(limit);

    const usersWithoutSensitiveData = users.map((user) => {
      const { password, token, ...safeUser } = user.toObject();
      return safeUser;
    });

    // Set custom pagination headers
    res.set({
      "Total-Users": totalUsers,
      "Total-Pages": Math.ceil(totalUsers / limit),
      "Current-Page": page,
      "Per-Page": limit,
    });

    logger.info(
      `Fetched ${usersWithoutSensitiveData.length} users on page ${page}`
    );

    res.status(200).json({ users: usersWithoutSensitiveData });
  } catch (error) {
    logger.error(`Error fetching users: ${error}`);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const sendInvitation = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id++++---//////****", id);
    const user = await Users.findOne({ id });
    console.log("user++++---//////****", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("user", user);
    const { email: toEmail, verify_token } = user;
    console.log("toEmail", toEmail);
    console.log("verify_token", verify_token);
    await sendVerificationEmail(toEmail, verify_token);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
    res.status(500).json({ error: "Error sending email" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { space_name, ...user } = req.body.user;
    console.log("space_name", space_name);
    console.log("user", user);
    if (!id || !user) {
      return res.status(422).json({ message: "Invalid request data" });
    }
    const updatedUser = await Users.findOneAndUpdate(
      { id },
      { ...user, workspace: { name: space_name, ...user.workspace } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("updatedUser", updatedUser);
    const { password, token, workspace, ...safeUser } = updatedUser.toObject();

    res.status(200).json({ user: { ...safeUser, workspace: null } });
  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    res.status(500).json({ error: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(422).json({ message: "Invalid request data" });
    }
    const deletedUser = await Users.findOneAndDelete({ id });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    res.status(500).json({ error: "Error deleting user" });
  }
};
