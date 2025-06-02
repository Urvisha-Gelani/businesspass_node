import express from "express";
import {
  createKeyNumber,
  getKeyNumbers,
} from "../controller/key_numbers.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
const keyNumbersRouter = express.Router();
keyNumbersRouter.use(authenticateToken);
keyNumbersRouter.post("/:ref_id/key_numbers", createKeyNumber);
keyNumbersRouter.get("/key_numbers", getKeyNumbers);
export default keyNumbersRouter;
