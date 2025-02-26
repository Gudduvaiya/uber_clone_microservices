import express from "express";
const ridesRoutes = express.Router();
import {
  createRide,
  logout,
  myProfile,
} from "../controller/rides.controller.js";
import { getUserDetailsMiddleware } from "../middlewares/authMiddleWare.js";

ridesRoutes.post("/create-ride", getUserDetailsMiddleware,createRide);
export default ridesRoutes;
