import { isRegValid, isLoginValid } from "../utills/validations.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { tokenGenerator } from "../utills/jwtTokenGen.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!isRegValid(req.body))
      return res.status(401).json("All fields are required");

    const existUser = await User.findOne({ username });

    if (existUser) return res.status(401).json("User already exists");

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      username,
      email,
      password: hash,
    });

    if (!createdUser) return res.json("invalid user data");

    res.status(201).json({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!isLoginValid(req.body))
      return res.status(401).json("All fieleds required");

    const userExist = await User.findOne({ username });
    if (!userExist) return res.status(404).json("User doesn't exist");

    const isPasswordCorrect = bcrypt.compareSync(password, userExist.password);
    if (!isPasswordCorrect) return res.status(401).json("Password incorrect");

    const token = tokenGenerator(userExist.id);

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({
        id: userExist.id,
        username: userExist.username,
        email: userExist.email,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out");
};
