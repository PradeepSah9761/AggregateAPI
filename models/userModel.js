import mongoose from 'mongoose';

const userSchema=await mongoose.Schema(

{

    name:{ type:String},
    age:{type:Number},
    course:{type:String},
    email:{type:String},
    password:{type:String},



    
}

);

export const userModel= await mongoose.model("studentData",userSchema);