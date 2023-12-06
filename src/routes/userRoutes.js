import express from "express";
import { updateUser, deleteUser } from "../controllers/userController.js";
const router = express.Router();

// router.get("/");
// router.get("/:id");

router.route("/:id").put(updateUser).delete(deleteUser);

export default router;
