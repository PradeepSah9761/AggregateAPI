import mongoose from 'mongoose';

const studentSchema=await mongoose.Schema(

{
    name:{ type:String},
    age:{type:Number},
    email:{type:String},
    password:{type:String},  
    gender:{type:String} 
}

);

const studentModel= await mongoose.model("studentData",studentSchema);
export {studentModel};