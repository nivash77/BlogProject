import { ConnectMongodb } from "../../../utils/ConnectMongodb";
import PostModel from "../../../../Model/PostModel";

export async function POST(req) {
  try {
    await ConnectMongodb();
    const { title, desc, img, commands, author, date, category } = await req.json();

    if (!title || !desc || !img || !author || !date || !category) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newPost = new PostModel({
      title,
      desc,
      img,
      commands: commands || [],
      author,
      date,
      category,
    });

    const savedPost = await newPost.save();

    return Response.json({ success: true, data: savedPost });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
