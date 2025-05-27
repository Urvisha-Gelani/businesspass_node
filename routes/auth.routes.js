import express from "express";
import { login } from "../controller/auth.controller.js";
import { updateUser } from "../controller/users.controller.js";

const authRouter = express.Router();

// authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.patch("/:id", updateUser); // Assuming this is for updating user info after login
// authRouter.post("/logout", logout);

export default authRouter;
