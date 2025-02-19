import express from 'express';
import connection from './models/connection.js';
import routes from './routes/route.js';

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',routes);

//To call the database function
connection();



//Listening The Port
app.listen(process.env.PORT || 4000,function()
{
    console.log("The Server is running");
    console.log('http://localhost:4000');
})