import {Router} from 'express';
import Test from '../models/Test.js';
import {auth} from '../middleware/auth.js';
const router=Router();
router.get('/',auth,async(req,res)=>res.json(await Test.find({createdBy:req.user.id}).populate('questions')));
router.post('/',auth,async(req,res)=>{try{const t=await Test.create({...req.body,createdBy:req.user.id});res.status(201).json(t)}catch(e){res.status(400).json({message:e.message})}});
router.get('/:id',async(req,res)=>{const t=await Test.findById(req.params.id).populate('questions');if(!t)return res.status(404).json({message:'Test not found'});res.json(t)});
export default router;