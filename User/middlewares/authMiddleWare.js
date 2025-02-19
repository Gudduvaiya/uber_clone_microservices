import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";

export const profileMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(400).json({ error: "Authorization Failed!" });
    }
    
    const isTokenValid=await blacklistTokenModel.findOne({token})
    
    if(isTokenValid){
      res.status(401).json({ error: "Bad Request Already Logged Out!" });
      return
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) {
      res.status(400).json({ error: "Authorization Failed!" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};
