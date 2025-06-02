import Users from "../models/users.model.js";
import userCreated from "../services/users.service.js";
import logger from "../utils/logger.js";
import { sendVerificationEmail } from "../services/email.service.js";
import Workspace from "../models/workspace.model.js";

export const createUser = async (req, res) => {
  try {
    console.log("req.body+++++++++++++++++++++++++++", req.body);
    const { user } = req.body;
    const currentUser = req.user.id;
    const { email } = user;
    const newUserData = {
      ...user,
      created_by_id: currentUser,
    };
    const existingUser = await Users.findOne({
      email,
    });
    logger.info(`existingUser: ${existingUser}`);
    if (existingUser) {
      logger.error(`createUser: Email already exists`);
      return res.status(422).json({ email: ["has already been taken"] });
    }
    const payloadUser = await userCreated(newUserData);
    if (!user) {
      return res.status(400).json({ message: "User creation failed" });
    }
    const {
      password,
      verify_token,
      workspace,
      location_name,
      location_id,
      ...safeUser
    } = payloadUser.toObject();
    safeUser.isSuperAdmin = user.user_type === "super_admin";

    res.status(201).json({ user: { ...safeUser, workspace: null } });
  } catch (error) {
    logger.error(`Error creating user: ${error}`);
    res.status(500).json({ error: "Error creating user" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const user = req.user;
    const { id: user_id } = user;
    const filter = { created_by_id: user_id };
    console.log("filter", filter);
    if (req.query.name) {
      filter.$or = [
        { first_name: { $regex: req.query.name, $options: "i" } },
        { last_name: { $regex: req.query.name, $options: "i" } },
      ];
    }

    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" };
    }

    if (req.query.country_name) {
      filter.country_name = { $regex: req.query.country_name, $options: "i" };
    }

    if (req.query.phone) {
      filter.phone = { $regex: req.query.phone, $options: "i" };
    }

    if (req.query.user_type) {
      filter.user_type = { $regex: req.query.user_type, $options: "i" };
    }

    if (req.query.workspace) {
      filter["workspace.name"] = { $regex: req.query.workspace, $options: "i" };
    }
    if (req.query.status) {
      filter.status = { $regex: req.query.status, $options: "i" };
    }
    if (req.query.with_guest === "false") {
      filter.user_type = { $ne: "guest" };
    }

    const totalUsers = await Users.countDocuments(filter);

    if (totalUsers === 0) {
      return res.status(200).json([]);
    }

    const users = await Users.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const usersWithoutSensitiveData = users.map((user) => {
      const { password, verify_token, ...safeUser } = user.toObject();
      return safeUser;
    });

    res.set({
      Total: totalUsers,
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
    const { user } = req.body;
    console.log("space_name", user.space_name);
    console.log("user", user);
    if (!id || !user) {
      return res.status(422).json({ message: "Invalid request data" });
    }
    let workspaceUpdate = {};
    if (user.space_name) {
      const updatedWorkspace = await Workspace.findOneAndUpdate(
        { user_id: id },
        { name: user.space_name },
        { new: true, runValidators: true }
      );
      workspaceUpdate.workspace = updatedWorkspace;
    }
    console.log("workspaceUpdate", workspaceUpdate);
    const updatedUser = await Users.findOneAndUpdate(
      { id },
      {
        ...user,
        ...workspaceUpdate,
      },
      { new: true, runValidators: true }
    );
    console.log("updatedUser", updatedUser);
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
    const deletedUser = await Users.findOneAndUpdate(
      { id },
      { status: "deleted" }
    );
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    res.status(500).json({ error: "Error deleting user" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(422).json({ message: "Invalid request data" });
    }
    const user = await Users.findOne({ verify_token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password) {
      return res.status(404).json({ message: "User already verified" });
    }
    console.log("user", user);
    res.status(200).json({ user, token: user.verify_token });
  } catch (error) {
    logger.error(`Error verifying user: ${error}`);
    res.status(500).json({ error: "Error verifying user" });
  }
};

export const confirmUser = async (req, res) => {
  try {
    const { token } = req.params;
    const userData = req.body;
    if (!token || !userData) {
      return res.status(422).json({ message: "Invalid request data" });
    }

    const user = await Users.findOne({ verify_token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let workspaceUpdate = {};
    if (userData.space_name) {
      const updatedWorkspace = await Workspace.findOneAndUpdate(
        { user_id: user.id },
        { name: userData.space_name },
        { new: true, runValidators: true }
      );
      workspaceUpdate.workspace = updatedWorkspace;
    }

    const updatedUser = await Users.findOneAndUpdate(
      { id: user.id },
      {
        ...userData,
        ...workspaceUpdate,
      },
      { new: true, runValidators: true }
    );

    const { password, verify_token, ...safeUser } = updatedUser.toObject();
    res.status(200).json({ user: safeUser, token: user.verify_token });
  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    res.status(500).json({ error: "Error updating user" });
  }
};

export const createPassword = async (req, res) => {
  try {
    const { user: reqUser } = req.body;
    const { password, reset_password_token } = reqUser;
    if (!reset_password_token || !password) {
      return res.status(422).json({ message: "Invalid request data" });
    }
    const user = await Users.findOne({ verify_token: reset_password_token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = password;
    user.status = "activated";
    await user.save();
    res.status(204).json({ message: "Password updated successfully" });
  } catch (error) {
    logger.error(`Error updating password: ${error}`);
    res.status(500).json({ error: "Error updating password" });
  }
};
