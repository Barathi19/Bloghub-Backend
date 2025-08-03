import { body } from "express-validator";

const register = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("firstName")
    .notEmpty()
    .withMessage("First Name should not be empty")
    .trim(),
  body("lastName")
    .notEmpty()
    .withMessage("Last Name should not be empty")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const login = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export default { register, login };
