import mongoose from 'mongoose';
// import { studentModel } from './userModel.js';

const courseSchema = mongoose.Schema(

    {
        courseId:{type:String,required:true,unique:true},
        courseName:{type:String,required:true,unique:true},
        duration:{type:Number},
        studentId:{type:mongoose.Schema.Types.ObjectId,ref:"studentData"}
    }
);

 const courseModel=mongoose.model("courseData",courseSchema);
 export {courseModel}