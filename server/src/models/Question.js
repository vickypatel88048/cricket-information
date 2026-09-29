import mongoose from 'mongoose';
const schema=new mongoose.Schema({question:{type:String,required:true},options:[String],correctIndex:{type:Number,required:true},explanation:String,subject:String,topic:String,createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true});
export default mongoose.model('Question',schema);