import captainModel from "../models/captain.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import { subscribeToQueue } from "../services/rabbit.js";

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const captain = await captainModel.findOne({ email });
    if (captain) {
      return res.status(400).json({ error: "User Already Exists!" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await captainModel({ name, email, password: hash });
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
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      res.status(404).json({ error: "User not Found!" });
    }
    if (captain) {
      const isMatched = await bcrypt.compare(password, captain.password);

      if (!isMatched) {
        res.status(400).send({ error: "Please check your EMail or Password!" });
        return;
      }
      const jwtToken = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", jwtToken);
      res.json({ messege: "Loggod In Successfull!", token: jwtToken, captain });
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
    res.json(req.captain);
  } catch (error) {
    res.status(500).send("SOmething went wrong!");
  }
};

export const toggeAvailablity = async (req, res) => {
  try {
    const captain = req.captain;
    await captainModel.findOneAndUpdate(captain._id, {
      isAvailable: !captain.isAvailable,
    });
    const newCaptain = await captainModel
      .findById(captain._id)
      .select("-password");

    res.json({
      message: `${
        !newCaptain.isAvailable
          ? "Captain is not Abailable right now!"
          : "Captain is Available right now"
      }`,
      captain: newCaptain,
    });
  } catch (error) {
    res.status(500).send("SOmething went wrong!");
  }
};

