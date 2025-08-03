import express from "express";
import blogController from "../controller/blog.controller.js";
import protect from "../middleware/jwt.js";
import validate from "../middleware/validate.js";
import blogValidate from "../validation/blog.validate.js";

const router = express.Router();

router.get("/", protect, blogController.getAllBlogs);
router.get(
  "/:id",
  protect,
  validate(blogValidate.checkBlogId),
  blogController.getBlogById
);
router.post("/", protect, validate(blogValidate.createBlog), blogController.createBlog);
router.put("/:id", protect, validate(blogValidate.updateBlog), blogController.updateBlog);
router.delete("/:id", protect, validate(blogValidate.checkBlogId), blogController.deleteBlog);

export default router;
