import { NextResponse } from 'next/server';
import { ConnectMongodb } from '../../../utils/ConnectMongodb';
import addUserModel from '../../../../Model/AddUser';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    await ConnectMongodb();
    const { username, email, DOB, password } = await req.json();

    if (!username || !email) {
      return NextResponse.json({ message: "Username and email are required" }, { status: 400 });
    }

    let hashedPassword;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const updateData = {
      email: email,
      DOB: DOB,
    };

    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    const updateResult = await addUserModel.updateOne(
      { username: username },
      { $set: updateData }
    );

    if (updateResult.modifiedCount > 0) {
      return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found or no changes made' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}
