import { NextResponse } from 'next/server';
import { ConnectMongodb } from '../../../utils/ConnectMongodb';
import UserModel from '../../../../Model/AddUser';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    await ConnectMongodb();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    if (password.trim() === '') {
      return NextResponse.json({ message: 'Password cannot be empty' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateResult = await UserModel.findOneAndUpdate(
      { username },
      { password: hashedPassword },
      { new: true }
    );

    if (!updateResult) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ message: 'Error updating password' }, { status: 500 });
  }
}