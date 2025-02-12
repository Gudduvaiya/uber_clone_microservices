import express from "express";
const userRoutes = express.Router();
import {register} from "../controller/user.controller.js";

userRoutes.post("/register", register);
export default userRoutes;
