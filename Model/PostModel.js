import { ConnectMongodb } from "../src/utils/ConnectMongodb";
import { model, models, Schema } from "mongoose";
const PostSchema =new Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    commands:{
    type:[{
        username:{
            type:String,
            required:true
        },
        command:{
            type:String,
            required:true
        }
    }],
    required:false
    }
    

},{toJSON:{virtuals:true}});
PostSchema.virtual('short_description').get(function(){
    return this.desc.substr(0,60)+'...'
})

const  PostModel=models.Post|| model('Post',PostSchema);
export default PostModel;