import Users from "../models/users.model.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const {
      user: { email, password: logInPassword },
    } = req.body;
    console.log(email, "email-------------------");
    const user = await Users.findOne({ email });
    console.log(
      logInPassword,
      "logInPassword-------------------",
      user.matchPassword(logInPassword)
    );
    console.log("user*****************************", user);
    if (!user || !(await user.matchPassword(logInPassword))) {
      console.log("Invalid credentials");
      return res.status(422).json({ message: "Invalid credentials" });
    }
    let token = user.token;
    let isTokenExpired = false;

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        logger.info("Token is valid");
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          isTokenExpired = true;
        } else {
          return res.status(401).json({ message: "Invalid token" });
        }
      }
    } else {
      isTokenExpired = true;
    }

    if (isTokenExpired) {
      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      user.token = token;
      await user.save();
    }

    console.log("token", token);
    const {
      password,
      token: userToken,
      ...userWithoutPassword
    } = user.toObject();
    res.set("Authorization", `Bearer ${token}`);
    console.log("user", user);

    res.status(200).json({ user: { ...userWithoutPassword } });
  } catch (error) {
    logger.error(`Error logging in: ${error}`);
    res.status(500).json({ error: "Error logging in" });
  }
};
