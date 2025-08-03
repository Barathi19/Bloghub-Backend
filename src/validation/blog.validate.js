import { body, param } from "express-validator";

const createBlog = [
  body("title").notEmpty().withMessage("Title should not be empty").trim(),
  body("content").notEmpty().withMessage("Content should not be empty").trim(),
];

const updateBlog = [
  body("title").trim(),
  body("content").trim(),
  param("id").isMongoId().withMessage("Invalid ObjectId").trim(),
];

const checkBlogId = [
  param("id").isMongoId().withMessage("Invalid ObjectId").trim(),
];

export default { createBlog, updateBlog, checkBlogId };
