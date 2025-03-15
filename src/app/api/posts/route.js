import { ConnectMongodb } from "../../../utils/ConnectMongodb";
import PostModel from "../../../../Model/PostModel";
export async function GET(){
    try{
        await ConnectMongodb();
        const postdata=await PostModel.find({});
        
        return Response.json(postdata);

    }
    catch(error){
       
        return Response.json(error.message);
    }
}
