
import express from 'express';
import  {userRegistration, userLogin, getUserAboveAge,userCountByCourse, latestUsers,getUserByAgeGroup} from  '../controllers/userController.js';
const routes=express.Router();

routes.post('/Register',userRegistration);
routes.post('/Login/',userLogin);
routes.get('/userCount',userCountByCourse);
routes.post('/getUserByAge',getUserAboveAge);
routes.post('/getLatestUser',latestUsers);

routes.post('/getUserByAgeGroup',getUserByAgeGroup);
export default routes;