import express from "express";
import userRoutes from "./routes/user.routes";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.get("/", userRoutes);

export default app;
