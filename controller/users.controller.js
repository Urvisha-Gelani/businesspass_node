import Users from "../models/users.model.js";
import userCreated from "../services/users.services.js";
import logger from "../utils/logger.js";
import { sendVerificationEmail } from "../services/email.services.js";

export const createUser = async (req, res) => {
  try {
    console.log("req.body+++++++++++++++++++++++++++", req.body);
    const { user } = req.body;
    const currentUser = req.user.id;

    const newUserData = {
      ...user,
      created_by_id: currentUser,
    };
    const payloadUser = await userCreated(newUserData);
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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.per, 10) || 10;
    const skip = (page - 1) * limit;
    const loginUser = req.user.id;
    const filter = { created_by_id: loginUser };
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
      "Total": totalUsers,
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
