import express from "express";
import {
  createAdminLocation,
  getAdminOffers,
  getUserLocations,
} from "../controller/admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/admin/:id/locations", getUserLocations);
adminRouter.post("/admin/:id/locations", createAdminLocation);
adminRouter.get("/admin/:id/offers", getAdminOffers);

export default adminRouter;
