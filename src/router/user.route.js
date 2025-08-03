import express from "express";
import protect from "../middleware/jwt.js";
import userController from "../controller/user.controller.js";

const router = express.Router();

router.get("/me", protect, userController.getUserDetail);

export default router;
