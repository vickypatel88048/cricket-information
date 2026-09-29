import {Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router=Router();
router.post('/register',async(req,res)=>{try{const{name,email,password,role='teacher'}=req.body;if(!name||!email||!password)return res.status(400).json({message:'name, email and password are required'});if(await User.findOne({email}))return res.status(409).json({message:'Email already registered'});const user=await User.create({name,email,passwordHash:await bcrypt.hash(password,12),role});const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET||'dev-secret-change-me',{expiresIn:'7d'});res.status(201).json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}})}catch(e){res.status(500).json({message:e.message})}});
router.post('/login',async(req,res)=>{try{const{email,password}=req.body;const user=await User.findOne({email});if(!user||!(await bcrypt.compare(password,user.passwordHash)))return res.status(401).json({message:'Invalid email or password'});const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET||'dev-secret-change-me',{expiresIn:'7d'});res.json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}})}catch(e){res.status(500).json({message:e.message})}});
export default router;