import { ConnectMongodb } from "../../../../utils/ConnectMongodb";
import PostModel from "../../../../../Model/PostModel";
export async function GET(req,{params}){
    try{
        await ConnectMongodb();
        const { id } = await params;
        const postdata=await PostModel.findById(id);
        
        return Response.json(postdata);

    }
    catch(error){
       
        return Response.json(error.message);
    }
}
