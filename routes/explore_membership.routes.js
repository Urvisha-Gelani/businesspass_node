import express from "express";
import {
  CreateExploreMemberships,
  getExploreMemberships,
} from "../controller/explore_membership.controller.js";
const exploreMembershipRouter = express.Router();

exploreMembershipRouter.post("/explore_memberships", CreateExploreMemberships);
exploreMembershipRouter.get("/explore_memberships", getExploreMemberships);

export default exploreMembershipRouter;
