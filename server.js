import dotenv from 'dotenv';
dotenv.config();

// modules imports
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
// App imports
import userRouter from './router/userRouter.js';

const port = process.env.PORT || 8000;//server running on PORT
connectDB();//Connect to MongoDB;

const app = express();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Api Routes
app.get('/', (req, res) => {
  res.send('<h1>Hi from the server</h1>');
});

app.use('/api/users', userRouter);


app.listen(port, () => console.log('Server is running on ' + port));