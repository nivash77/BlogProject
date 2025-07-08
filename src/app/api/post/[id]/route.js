import { NextResponse } from 'next/server';
import { ConnectMongodb } from '../../../../utils/ConnectMongodb';
import PostModel from '../../../../../Model/PostModel';

export async function GET(req,{ params }) {
  try {
    await ConnectMongodb();

    const { id } = await params;
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    // if (!userId) {
    //   return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    // }

    const post = await PostModel.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
     if (userId && userId !== 'anonymous') {
      if (!post.viewedBy.includes(userId)) {
        post.viewedBy.push(userId);
        post.views = post.viewedBy.length;
        await post.save();
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
