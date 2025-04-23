import { NextResponse } from 'next/server';
import { ConnectMongodb } from '../../../utils/ConnectMongodb';
import PostModel from '../../../../Model/PostModel';

export async function DELETE(req) {
  try {
    await ConnectMongodb();
    const { id, username, command } = await req.json();

    if (!id || !username || !command) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const updateResult = await PostModel.findOneAndUpdate(
      { _id: id },
      { $pull: { commands: { username, command } } },
      { new: true }
    );

    if (!updateResult) {
      return NextResponse.json({ message: 'Comment not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ message: 'Error deleting comment' }, { status: 500 });
  }
}