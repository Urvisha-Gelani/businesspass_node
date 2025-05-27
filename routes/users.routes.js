import express from "express";

import authenticateToken from "../middlewares/auth.middleware.js";
import {
  createUser,
  deleteUser,
  getAllUsers,
  sendInvitation,
  updateUser,
} from "../controller/users.controller.js";
const userRouter = express.Router();
userRouter.use(authenticateToken);

userRouter.post("/users", createUser);

userRouter.get("/users", getAllUsers);
userRouter.post("/users/:id/send_invitations", sendInvitation);
userRouter.patch("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);

export default userRouter;
