

import { userModel } from "../models/userModel.js";
import validate from 'validator';
import bcrypt from 'bcryptjs';
import { group } from "console";


//User Registration 
const userRegistration=async (req,res)=>
{
    const {name,age,course,email,password,confirmPassword}=req.body;
    if(!name || !age || !course || !email || !password || !confirmPassword)
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
    const userEmail=await userModel.findOne({email:email});
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
    const user=new userModel(
    {
        name:name,
        age:age,
        course:course,
        email:email,
        password:hashPassword
    }
);

  const newUser= await user.save();
      res.status(201).json(
    {
        message:"User Registration Successfully"
    }
  )
}


//To Login 
const userLogin=async (req,res)=>
{

    const {email,password}=req.body;

    
    if(!email || !password)
    {
       return  res.send({message:"All Fields are required"})
    }


    const user=await userModel.findOne({email:email});
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

//To Count User By Course
const userCountByCourse=async (req,res)=>
{

    try{
        const courseStats = await userModel.aggregate([
            {
                $group: {
                    _id: "$course", // Group by course field
                    userCount: { $sum: 1 } // Count number of users
                }
            },
        ]);

        res.status(200).json(
            {
                message:"User Count Per Course",
                data:courseStats
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

        const result = await userModel.aggregate([
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
 const latestUser=await userModel.aggregate(
    [
        { $sort:{_id:-1}},
           { $limit:parseInt(userLimit)},
           {$project:{
            name:1,
            age:1,
            course:1,
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
        const result=await userModel.aggregate(
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



export  {userRegistration,userLogin,userCountByCourse,getUserAboveAge,latestUsers,getUserByAgeGroup};