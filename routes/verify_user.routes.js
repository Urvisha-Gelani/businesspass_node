import express from "express";
import {
  confirmUser,
  createPassword,
  verifyUser,
} from "../controller/users.controller.js";
const verifyUserRouter = express.Router();

verifyUserRouter.get("/verify_user/:token", verifyUser);
verifyUserRouter.post("/confirm_user/:token", confirmUser);
verifyUserRouter.put("/users/password", createPassword);

export default verifyUserRouter;
