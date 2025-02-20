import mongoose from "mongoose";

const captainSchema=new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        required:true,
        default:false
    }
})

export default mongoose.model('captains',captainSchema)