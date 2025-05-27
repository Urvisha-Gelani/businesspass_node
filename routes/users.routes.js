import express from "express";

import authenticateToken from "../middlewares/auth.middleware.js";
import {
  createUser,
  deleteUser,
  getAllUsers,
  sendInvitation,
  updateUser,
} from "../controller/users.controller.js";
import { validateCreateUser } from "../validator/user.validator.js";
const userRouter = express.Router();
userRouter.use(authenticateToken);

userRouter.post("/users", validateCreateUser, createUser);

userRouter.get("/users", getAllUsers);
userRouter.post("/users/:id/send_invitations", sendInvitation);
userRouter.patch("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);

export default userRouter;
