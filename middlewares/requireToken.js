import jwt from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/tokenManager.js";

export const requireToken = (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw new Error("No Bearer");

    const payload = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    req.uid = payload.uid;

    next();
  } catch (error) {
    console.log(error.message);

    return res
      .status(401)
      .json({ error: tokenVerificationErrors[error.message] });
  }
};
