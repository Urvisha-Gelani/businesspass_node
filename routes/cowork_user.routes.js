import express from "express";
import {
  createCoWorkUser,
  deleteCoWorkUser,
  getAllCoWorkUsers,
  updateCoWorkUser,
} from "../controller/cowork_user.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const coWorkUserRouter = express.Router();
coWorkUserRouter.use(authenticateToken);

coWorkUserRouter.post("/cowork_users", createCoWorkUser);
coWorkUserRouter.get("/cowork_users", getAllCoWorkUsers);
coWorkUserRouter.patch("/cowork_users/:id", updateCoWorkUser);
coWorkUserRouter.delete("/cowork_users/:id", deleteCoWorkUser);

export default coWorkUserRouter;
