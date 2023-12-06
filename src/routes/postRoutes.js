import express from "express";
import {
  addPost,
  deletePost,
  getPosts,
  getSinglePost,
  updatePost,
} from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/").get(getPosts).post(authMiddleware, addPost);
router
  .route("/:id")
  .get(authMiddleware, getSinglePost)
  .put(authMiddleware, updatePost)
  .delete(authMiddleware, deletePost);

export default router;
