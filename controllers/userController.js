

import { studentModel } from "../models/userModel.js";
import validate from 'validator';
import bcrypt from 'bcryptjs';
import { courseModel } from "../models/courseModel.js";
import moment from 'moment-timezone';



//User Registration 
const userRegistration=async (req,res)=>
{
    const {name,age,email,password,confirmPassword,gender}=req.body;
    if(!name || !age  || !email || !password || !confirmPassword || !gender)
    {
       return res.status(401).json(
            {
                message:"All the fields are required"
            }
        )
    }
    
if(!validate.isEmail(email))
{
     return res.status(401).json(
    {
        message:"Entered Invalid Email"
    }
)
}
    const userEmail=await studentModel.findOne({email:email});
    if(userEmail)
    {
       return res.status(401).json({
            message:"Email Is Already Exists"
        })
    }

    if(password !== confirmPassword)
    {
        return res.send({
            message:"Password and Confirm Password doesn't Match"
        })
    }
    const hashPassword=await bcrypt.hash(password,10);
    const user=new studentModel(
    {
        name:name,
        age:age,
        email:email,
        gender,
        password:hashPassword,
        createdAt:moment().utc().toISOString()
    }
);

  const newUser= await user.save();
      res.status(201).json(
    {
        message:"User Registration Successfully"
    }
  )
}


//To Register Course Details

const courseRegister= async(req,res)=>

{

    const {courseId,courseName,duration,studentId}=req.body;

    if(!courseId || !courseName || !duration || !studentId )
    {
        res.send({status:"failed",message:"All Fields are required"})
    }

    const courseData=new courseModel(
        {
            courseId,courseName,duration,
            studentId
        }
    );
    await courseData.save();
    res.send({message:"course Deatail register successfully"});

}

//To Login 
const userLogin=async (req,res)=>
{

    const {email,password}=req.body;

    
    if(!email || !password)
    {
       return  res.send({message:"All Fields are required"})
    }


    const user=await studentModel.findOne({email:email});
    if(!user)
    {
        return res.status(401).json(
            {
                message:"Email not registered Or Entered wrong Email"
            }
        )
    }
    const unHashedPassword=await bcrypt.compare(password,user.password)
    
    if(!unHashedPassword)
    {
        return res.send({message:"Entered Wrong Password"})
    }
    res.status(200).json(
        {
            message:"User Login Successfully"
        }
    )
}

//To Count User By Gender
const userCountByCourse=async (req,res)=>
{

    try{
        const groupState = await studentModel.aggregate([
            {
                $group: {
                    _id: "$gender", // Group by gender field
                    studentCount: { $sum: 1 } // Count number of student
                }
            },
        ]);

        res.status(200).json(
            {
                message:"Student Count By Gender",
                data:groupState
            }
        )

    }
    catch(error)
    {
        return res.send({message:"Error Fetching Data"})
    }
}

//Find Users Older Than a Certain Age
const getUserAboveAge = async (req, res) => {
    try {
        const { minAge } = req.query;

        const result = await studentModel.aggregate([
            {
                $match: {
                    age: { $gte: parseInt(minAge) }
                }
            }
        ]);

        res.status(200).json({
            message: `Users above ${minAge} retrieved successfully`,
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//To Get Latest User

const latestUsers= async (req,res)=>
{
    const {userLimit}=req.query;
 const latestUser=await studentModel.aggregate(
    [
        { $sort:{_id:-1}},
           { $limit:parseInt(userLimit)},
           {$project:{
            name:1,
            age:1,
            gender:1,
            _id:0
           }}
    ]
);
res.send({
    message:` Latest ${userLimit} Users`,
    data:latestUser
})

}

//Get User By Age Group
const getUserByAgeGroup= async (req,res)=>
{
    try
    {
        const result=await studentModel.aggregate(
            [
                {$bucket:
                    {
                        groupBy:"$age",
                        boundaries:[0,18,26,41,100],
                        default:  "Unknown",
                        output:
                        {
                            count:{$sum:1}
                        }

                    }
                }
            ]
        );
        res.status(200).json(
            {
                message:"Users grouped by age range",
                data:result
            }
        )

    }
    catch(err)
    {
        res.status(500).json(
            {
                message:"Internal Server Error",
                error:err.message
            }
        )
    }
}

//Use Of Lookup to join student data and course data

const studentWithCourseDetail= async (req,res)=>
{
   const studentDetailWithCourse= await studentModel.aggregate(
        [
            {$lookup:{
                from:"coursedatas",
                localField:"_id",
                foreignField:"studentId",
                as:"courseDetail"
            }}
        ]
    );
    // console.log(studentWithCourseDetail());
    res.send(studentDetailWithCourse);

}

//Use Of Lookup to join student data and course data

const courseDetailWithStudentDetail= async (req,res)=>
    {
       const courseDetailWithStudent= await courseModel.aggregate(
            [
                {$lookup:{
                    from:"studentdatas",
                    localField:"studentId",
                    foreignField:"_id",
                    as:"studentDetail"
                }}
            ]
        );
        // console.log(studentWithCourseDetail());
        res.send(courseDetailWithStudent);
    
    }
   
    
    //Convert Age to categories

    const ageByCategory= async(req,res)=>

    {
       const result=await studentModel.aggregate(
        [
            {
                   $addFields:
                   {
                    
                    ageCategory:
                    {
                    $cond:
                    {
                        if:{$lt:["$age",18]},
                        then:"Minor",
                        else:"Major"
                    }
                   }
                     }  }
        ]
       )
       res.send(result);
    }

    // Update API
    const updateData = async (req, res) => {
        try {
            const { filter, update } = req.body; 
    
            if (!filter || !update) {
                return res.status(400).json({ message: "Filter and update fields are required" });
            }
    
            const updatedData = await studentModel.updateOne(filter, { $set: update });
    
            if (updatedData.matchedCount === 0) {
                return res.status(404).json({ message: "No student found with the given criteria" });
            }
    
            res.status(200).json({
                message: "Student Updated Successfully",
                data: updatedData
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
    

    // To Get all user from database
    const getAllUser= async(req,res)=>
    {
        const allUser= await studentModel.find({});
        res.send({
            message:"All The  Registred Student ",
            data:allUser
        })
    }
    




export  {userRegistration,userLogin,userCountByCourse,getUserAboveAge,courseRegister,latestUsers,getUserByAgeGroup,studentWithCourseDetail,courseDetailWithStudentDetail,ageByCategory,updateData,getAllUser};