import asyncHandler from "../middleware/async.js";
import BlacklistToken from "../model/blacklistToken.model.js";
import User from "../model/user.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import { sendResponse } from "../utils/response.js";
import jwt from "jsonwebtoken";

/** Register */
const register = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const isEmailAlreadyExist = await User.findOne({ email });
  if (isEmailAlreadyExist) {
    return next(new ErrorResponse("Email already exist", 409));
  }

  const user = new User(req.body);
  await user.save();

  const { password, ...other } = user._doc;
  sendResponse(other, 201, res);
});

/** Login */
const login = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    return next(new ErrorResponse("User not exist", 404));
  }

  const user = await User.findOne({ email });

  const isPasswordMatch = await user.matchPassword(req.body.password);
  if (!isPasswordMatch) {
    return next(new ErrorResponse("Invalid Credantials", 401));
  }

  // Generate Access Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const { password, ...userDetails } = user._doc;
  sendResponse({ ...userDetails, token }, 200, res);
});

/** Logout */
const logout = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorResponse("Token missing!", 401));
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Revoke Access Token
  await BlacklistToken.create({
    token,
    expiresAt: new Date(decoded.exp * 1000),
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export default { register, login, logout };
