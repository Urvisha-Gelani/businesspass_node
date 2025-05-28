import { body } from "express-validator";

export const locationValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("country_id")
    .notEmpty()
    .withMessage("Country ID is required")
    .isNumeric()
    .withMessage("Country ID must be a number"),
  body("latitude").notEmpty().withMessage("Latitude is required"),
  body("longitude").notEmpty().withMessage("Longitude is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("phone_no").notEmpty().withMessage("Phone number is required"),
  body("location_url").notEmpty().withMessage("Location URL is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("postal_code").notEmpty().withMessage("Postal code is required"),
];
