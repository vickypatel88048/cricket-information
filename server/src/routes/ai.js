import {Router} from 'express';
import multer from 'multer';
import {auth} from '../middleware/auth.js';
import {saveGeneratedQuestions} from '../services/aiQuestionGenerator.js';
const router=Router();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:10*1024*1024}});
router.post('/generate',auth,upload.single('file'),async(req,res)=>{try{
  const topic=req.body.topic||'General';
  const count=Math.min(Math.max(Number(req.body.count)||10,1),50);
  const notes=req.body.notes||'';
  const result=await saveGeneratedQuestions(req.user.id,{topic,count,notes});
  res.status(201).json({message:`Generated ${result.questions.length} questions`,provider:result.provider,questions:result.questions});
}catch(e){res.status(400).json({message:e.message})}});
export default router;
