import express from "express";
import authController from "../controller/auth.controller.js";
import authValidate from "../validation/auth.validate.js";
import validate from "../middleware/validate.js";
import protect from "../middleware/jwt.js";

const router = express.Router();

router.post(
  "/register",
  validate(authValidate.register),
  authController.register
);
router.post("/login", validate(authValidate.login), authController.login);
router.post('/logout', protect, authController.logout)

export default router;
