import mongoose from 'mongoose';



const connection= async function(req,res)

{

    try{

   await  mongoose.connect("mongodb+srv://pradeep:pradeepsahdb@cluster0.yngar.mongodb.net/UserData?retryWrites=true&w=majority&appName=Cluster0")

     console.log("Connection Established Successfully");

    }

    catch(error)

    {
      console.log("There is an issue with establishing the database ",error.message);
      throw error
    }





}

export default connection;