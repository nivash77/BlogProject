
import { ConnectMongodb } from "../../../utils/ConnectMongodb";
import PostModel from "../../../../Model/PostModel";

export async function POST(req) {
  try {
    await ConnectMongodb();
    const { title, desc, img, commands,author,date } = await req.json();
    if (!title || !desc || !img) {
      return Response.json(
        { success: false, message: "Title, description, and image are required" },
        { status: 400 }
      );
    }

    const newPost = new PostModel({
      title,
      desc,
      img,
      commands: commands || [],
      author:author,
      date:date
    });

    const savedPost = await newPost.save();

    return Response.json({ success: true, data: savedPost });

  } catch (error) {
    //console.error("Error saving post:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
