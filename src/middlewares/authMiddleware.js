import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;
  try {
    if (!token) return res.status(401).json("You are not authenticated");

    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decodedInfo.id);

    req.user = currentUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json("You are not authenticated");
  }
};
