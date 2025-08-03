import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
