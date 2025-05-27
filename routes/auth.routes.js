import express from "express";
import { login } from "../controller/auth.controller.js";

const authRouter = express.Router();

// authRouter.post("/register", register);
authRouter.post("/login", login);
// authRouter.post("/logout", logout);

export default authRouter;