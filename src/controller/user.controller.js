import mongoose from "mongoose";
import asyncHandler from "../middleware/async.js";
import User from "../model/user.model.js";
import { sendResponse } from "../utils/response.js";

const getUserDetail = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userDetail = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "_id",
        foreignField: "userId",
        as: "blogs",
      },
    },
    {
      $project: {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ]);

  sendResponse(userDetail, 200, res);
});

export default { getUserDetail };
