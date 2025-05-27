import express from "express";
import { getAllCountries } from "../controller/countries.controller.js";

const countriesRouter = express.Router();

countriesRouter.get("/countries", getAllCountries);

export default countriesRouter;
