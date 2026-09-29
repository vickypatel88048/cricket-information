import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import testRoutes from './routes/tests.js';

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.get('/api/health',(req,res)=>res.json({ok:true,service:'AutoExam API',time:new Date().toISOString()}));
app.use('/api/auth',authRoutes);
app.use('/api/questions',questionRoutes);
app.use('/api/tests',testRoutes);
const port=process.env.PORT||5000;
mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/autoexam').then(()=>app.listen(port,()=>console.log(`AutoExam API running on ${port}`))).catch(err=>{console.error('MongoDB connection failed:',err.message);process.exit(1)});