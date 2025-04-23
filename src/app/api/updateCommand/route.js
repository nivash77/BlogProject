import { NextResponse } from 'next/server';
import { ConnectMongodb } from '../../../utils/ConnectMongodb';
import PostModel from '../../../../Model/PostModel';

export async function PUT(req) {
  try {
    await ConnectMongodb();
    const { id, command, username } = await req.json();

    if (!id || !command || !username) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (command.trim() === '') {
      return NextResponse.json({ message: 'Comment cannot be empty' }, { status: 400 });
    }
    const updateResult = await PostModel.findOneAndUpdate(
      { _id: id, 'commands.username': username },
      { $set: { 'commands.$.command': command } },
      { new: true }
    );

    if (!updateResult) {
      return NextResponse.json({ message: 'Comment not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ message: 'Error updating comment' }, { status: 500 });
  }
}