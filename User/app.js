import express, { json } from "express";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from "./db/dbConnection.js";

dotenv.config();
const app = express();
connectDB()

app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", userRoutes);

export default app;
