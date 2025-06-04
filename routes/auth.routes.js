import express from "express";
import { login } from "../controller/auth.controller.js";
import { updateUser } from "../controller/users.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.patch("/:id", updateUser);
// authRouter.post("/logout", logout);

export default authRouter;
