
import express from 'express';
import  {userRegistration, userLogin, getUserAboveAge,userCountByCourse,courseRegister ,ageByCategory,latestUsers,getUserByAgeGroup,studentWithCourseDetail,courseDetailWithStudentDetail,updateData,getAllUser} from  '../controllers/userController.js';
const routes=express.Router();

routes.post('/Register',userRegistration);
routes.post('/Login/',userLogin);
routes.get('/userCount',userCountByCourse);
routes.post('/getUserByAge',getUserAboveAge);
routes.post('/getLatestUser',latestUsers);

routes.post('/getUserByAgeGroup',getUserByAgeGroup);
routes.get('/getStuentWithCourse',studentWithCourseDetail);
routes.post('/getCourseRegister',courseRegister);
routes.get('/getCourseDetailWithStudent',courseDetailWithStudentDetail);
routes.get('/getaAgeByCategory',ageByCategory);
routes.put('/updataData',updateData);
routes.get('/getAllUser',getAllUser);


export default routes;