import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected with DB Successfully!");
    })
    .catch((e) => console.log(e));
};
