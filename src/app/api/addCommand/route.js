import PostModel from '../../../../Model/PostModel';
import { ConnectMongodb } from '../../../utils/ConnectMongodb';

export async function POST(req) {
  try {
    await ConnectMongodb();
    const { postId, username, command } = await req.json();

    if (!postId || !username || !command) {
      return Response.json(
        { success: false, message: 'Post ID, username, and comment are required' },
        { status: 400 }
      );
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return Response.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    post.commands.push({ username, command });
    await post.save();

    return Response.json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
