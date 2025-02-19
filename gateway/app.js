import express from "express";
import httpProxy from "express-http-proxy";

const app = express();

app.use("/user", httpProxy("http://localhost:3001"));

app.listen(3000, () => {
  console.log("Server Running on Port 3000");
});
