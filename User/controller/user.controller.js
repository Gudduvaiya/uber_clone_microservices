import userModel from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

module.exports.register=async(req,res)=>{
    try {
        const {email,password,name}=req.body
        const user=await userModel.findOne({email})
        if(user){
            return res.status(400).json({"error":"User Already Exists!"})
        }

        const hash=bcrypt.hash(password,10)
        const newUser=await userModel({name,email,password:hash})
        await newUser.save()
        var token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET,{expiresIn:'1h'});

    } catch (error) {
        console.log(error);
        
    }
}