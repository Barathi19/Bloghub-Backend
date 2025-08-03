import mongoose from "mongoose";
import asyncHandler from "../middleware/async.js";
import Blog from "../model/blog.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import { sendResponse } from "../utils/response.js";

const lookupForAuthor = [
  {
    $lookup: {
      from: "users",
      let: { userId: "$userId" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$userId"] },
          },
        },
        {
          $project: {
            _id: 0,
            fullName: { $concat: ["$firstName", " ", "$lastName"] },
          },
        },
      ],
      as: "author",
    },
  },
  {
    $unwind: "$author",
  },
  {
    $project: {
      userId: 1,
      author: "$author.fullName",
      title: 1,
      content: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

/** Get All Blogs with author name */
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.aggregate(lookupForAuthor);

  sendResponse(blogs, 200, res);
});

/** Get Single Blog by its ID  */
const getBlogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const [blog] = await Blog.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    ...lookupForAuthor,
  ]);

  if (!blog) {
    return next(new ErrorResponse("Blog not found", 404));
  }

  sendResponse(blog, 200, res);
});

/** Create new Blog */
const createBlog = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user._id;

  const isBlogAlreadyExist = await Blog.findOne({ title, userId });
  if (isBlogAlreadyExist) {
    return next(new ErrorResponse("Blog already exist", 409));
  }

  const blog = new Blog({ userId, content, title });
  await blog.save();

  sendResponse(blog, 201, res, "Blog created successfully");
});

/** Update blog */
const updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user._id;

  const isBlogAlreadyExist = await Blog.findOne({
    title,
    userId,
    _id: { $ne: id },
  });
  if (isBlogAlreadyExist) {
    return next(new ErrorResponse("Blog already exist", 409));
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorResponse("Blog not found", 404));
  }

  if (blog.userId.toString() !== userId.toString()) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  blog.title = title || blog.title;
  blog.content = content || blog.content;
  await blog.save();

  sendResponse(blog, 200, res, "Blog updated successfully");
});

/** Delete blog by ID */
const deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorResponse("Blog not found", 404));
  }

  if (blog.userId.toString() !== userId.toString()) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  await Blog.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

export default { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
