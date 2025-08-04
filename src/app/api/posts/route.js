// import { ConnectMongodb } from "../../../utils/ConnectMongodb";
// import PostModel from "../../../../Model/PostModel";
// export async function GET(){
//     try{
//         await ConnectMongodb();
//         const postdata=await PostModel.find({});
        
//         return Response.json(postdata);

//     }
//     catch(error){
       
//         return Response.json(error.message);
//     }
// }
import { ConnectMongodb } from "../../../utils/ConnectMongodb";
import PostModel from "../../../../Model/PostModel";

export async function GET(req) {
  try {
    await ConnectMongodb();
   console.log("Hi");
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const category = searchParams.get("category");
    const limit = 6;
    const skip = (page - 1) * limit;

    const filter = category && category !== "All" ? { category } : {};

    const posts = await PostModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await PostModel.countDocuments(filter);

    return Response.json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
