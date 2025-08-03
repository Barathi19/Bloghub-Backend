import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";
import BlacklistToken from "../model/blacklistToken.model.js";
import User from "../model/user.model.js";

const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  try {
    const isBlacklisted = await BlacklistToken.findOne({ token });

    if (isBlacklisted) {
      return next(new ErrorResponse("Token has been revoked.", 401));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id, { password: 0 });

    if (!user) {
      return next(new ErrorResponse("User not found. Unauthorized", 401));
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return next(new ErrorResponse("Invalid token. Unauthorized.", 401));
  }
};

export default protect;
