import { NextResponse } from 'next/server';
import { ConnectMongodb } from '../../../utils/ConnectMongodb';
import PostModel from '../../../../Model/PostModel';

export async function POST(req) {
  try {
    await ConnectMongodb();
    const { id, title, desc, img } = await req.json();

    if (!id || !title || !desc || !img) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const updateResult = await PostModel.updateOne(
      { _id: id },
      { $set: { title, desc, img } }
    );

    if (updateResult.modifiedCount > 0) {
      return NextResponse.json({ message: 'Post updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Post not found or no changes made' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ message: "Error updating post" }, { status: 500 });
  }
}
