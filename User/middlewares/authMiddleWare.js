import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const profileMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split("")[1];
    if (!token) {
      res.status(400).json({ error: "Authorization Failed!" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      res.status(400).json({ error: "Authorization Failed!" });
    }

    req.user = user;
    next();
  } catch (error) {
    req.status(500).json({ error: "Something went wrong!" });
  }
};
