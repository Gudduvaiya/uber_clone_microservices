import express from "express";
const userRoutes = express.Router();
import {
  login,
  logout,
  myProfile,
  register,
} from "../controller/user.controller.js";
import { profileMiddleware } from "../middlewares/authMiddleWare.js";

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/logout", logout);
userRoutes.get("/my-profile", profileMiddleware, myProfile);
export default userRoutes;
