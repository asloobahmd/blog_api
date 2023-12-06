import jwt from "jsonwebtoken";

export const tokenGenerator = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
