import jwt from "jsonwebtoken";
import axios from "axios";

export const getUserDetailsMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "Authorization Failed!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //This is called Synchronous Communication in terms of Microservices.
    const response = await axios.get("http://localhost:3000/user/my-profile", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    const user = response.data;

    if (!user) {
      return res.status(400).json({ error: "User Not Found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Something went wrong!" });
  }
};
