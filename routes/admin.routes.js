import express from "express";
import {
  createAdminLocation,
  getUserLocations,
} from "../controller/admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/admin/:id/locations", getUserLocations);
adminRouter.post("/admin/:id/locations", createAdminLocation);

export default adminRouter;
