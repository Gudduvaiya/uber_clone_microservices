import app from "./app.js";
import http from "http";

const server = http.createServer(app);

server.listen(3002, () => {
  console.log("User Server Running on Port 3002");
});
