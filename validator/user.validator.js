import { body } from "express-validator";

export const validateCreateUser = [
  body("first_name").notEmpty().withMessage("First name is required"),

  body("last_name").notEmpty().withMessage("Last name is required"),

  body("email").isEmail().withMessage("Valid email is required"),

  body("phone").notEmpty().withMessage("Phone is required"),

  body("country_id")
    .notEmpty()
    .withMessage("Country ID is required")
    .isNumeric()
    .withMessage("Country ID must be a number"),

  body("preferred_language")
    .notEmpty()
    .withMessage("Preferred language is required"),

  body("user_type")
    .notEmpty()
    .withMessage("User type is required"),

  body("position")
    .if(body("user_type").equals("cowork_admin"))
    .notEmpty()
    .withMessage("Position is required for cowork_admin"),
];
