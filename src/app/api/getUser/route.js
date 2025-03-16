import { NextResponse } from 'next/server';
import { ConnectMongodb } from '../../../utils/ConnectMongodb';
import addUserModel from '../../../../Model/AddUser';

export async function GET(req) {
  try {
    await ConnectMongodb();

    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ message: "Username is required" }, { status: 400 });
    }

    const user = await addUserModel.findOne({ username: username });

    if (user) {
      const userData = {
        username: user.username,
        email: user.email,
        DOB: user.DOB,
      };
      return NextResponse.json(userData, { status: 200 });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Error fetching user" }, { status: 500 });
  }
}
