import {Router} from 'express';
import Question from '../models/Question.js';
import {auth} from '../middleware/auth.js';
const router=Router();
router.get('/',auth,async(req,res)=>res.json(await Question.find({createdBy:req.user.id}).sort({createdAt:-1})));
router.post('/',auth,async(req,res)=>{try{const q=await Question.create({...req.body,createdBy:req.user.id});res.status(201).json(q)}catch(e){res.status(400).json({message:e.message})}});
router.post('/bulk',auth,async(req,res)=>{try{const list=(req.body.questions||[]).map(q=>({...q,createdBy:req.user.id}));const saved=await Question.insertMany(list);res.status(201).json({count:saved.length,questions:saved})}catch(e){res.status(400).json({message:e.message})}});
export default router;