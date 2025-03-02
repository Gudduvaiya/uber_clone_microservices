import ridesModel from "../models/rides.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { publishToQueue } from "../services/rabbit.js";

export const createRide = async (req, res) => {
  try {
    const { source, destination } = req.body;
    const newRide = new ridesModel({
      source,
      destination,
      user: req.user._id,
    });
    await newRide.save();

    // Here to communicate with tith captains, we need a message broker who sends our ride request to all the available captains. So that's why rabitmq comes into the picture..

    // Rabbit MQ is an message broker which performs asynchrouns operations in microSevices structure. It has a Queue to perform it's task.

    // To perform asynchronous communication between 2 microservices we use Rabbit MQ.

    publishToQueue("new-ride", JSON.stringify(newRide));
    res.send({ message: "Ride Created Successfully!", newRide });

    //here we publish a queue to RabbitMQ. new-ride is the queue name and then we send the ride Data over there.
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
        return;
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
