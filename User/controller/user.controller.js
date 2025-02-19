import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import blacklistTokenModel from "../models/blacklistToken.model.js";

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User Already Exists!" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await userModel({ name, email, password: hash });
    await newUser.save();
    var token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.send({ message: "User Registered Successfully!", token, newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went Wrong!" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      res.status(404).json({ error: "User not Found!" });
    }
    if (user) {
      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        res.status(400).send({ error: "Please check your EMail or Password!" });
        return
      }
      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", jwtToken);
      res.json({ messege: "Loggod In Successfull!", token: jwtToken, user });
    }
  } catch (error) {
    console.log(error);

    res.status(500).send("SOmething went wrong!");
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ error: "Authorizarion Failed!" });
      return;
    }
    await blacklistTokenModel.create({ token });
    res.clearCookie("token");
    res.json({ message: "User logged out Successfully!" });
  } catch (error) {
    res.status(500).send("SOmething went wrong!");
  }
};

export const myProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).send("SOmething went wrong!");
  }
};
