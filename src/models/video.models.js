import mongoose ,{ Schema} from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
   videoFile:{
    type:String,
    required:true,
   },
   thumbnail:{
    type:String,
    required:true,
    unique:true,
   },
   Owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
   },
   title:{
    type:String,
    required:true,
    unique:true,
   },
   discription:{
    type:String,
    required:true,
    unique:true,
   },
   duration:{
    type:Number,
    required:true,
   },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:boolean,
        default:true,
    }

},{
    timestamps:true
});

videoSchema.plugin(mongooseAggregatePaginate);//Take my videoSchema and add the aggregate-pagination functionality provided by mongooseAggregatePaginate


export const Video=mongoose.model('Video',videoSchema);