import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/db.js';

dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(express.json()); // Call express.json() function
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
console.log("hello")
console.log("morning")
app.use('/api/users',userRoutes)
   
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
