import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User Already Exists!" });
    }

    const hash = bcrypt.hash(password, 10);
    const newUser = await userModel({ name, email, password: hash });
    await newUser.save();
    var token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.send({ message: "User Registered Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went Wrong!" });
  }
};
