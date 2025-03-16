import { NextResponse } from 'next/server';
import { ConnectMongodb } from '../../../utils/ConnectMongodb';
import PostModel from '../../../../Model/PostModel';

export async function GET(req) {
  try {
    await ConnectMongodb();
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ message: "Username is required" }, { status: 400 });
    }
    const userPosts = await PostModel.find({ author: username });
    return NextResponse.json(userPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
  }
}
