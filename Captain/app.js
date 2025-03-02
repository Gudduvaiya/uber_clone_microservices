import express, { json } from "express";
import captainRoutes from "./routes/captain.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/dbConnection.js";
import morgan from "morgan";
import { connectToAMQP, subscribeToQueue } from "./services/rabbit.js";

dotenv.config();
const app = express();
connectDB();
app.use(morgan("dev"));
// connectToAMQP();

subscribeToQueue("new-ride", (data) => {
  console.log(JSON.parse(data));
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", captainRoutes);

export default app;
