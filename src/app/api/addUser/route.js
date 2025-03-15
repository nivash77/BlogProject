import addUserModel from "../../../../Model/AddUser";
import { ConnectMongodb } from "../../../utils/ConnectMongodb";

export async function POST(req) {
  try {
    await ConnectMongodb();
    const { username, email, password, DOB } = await req.json();

    // Check for existing username or email
    const existingUser = await addUserModel.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      let message = '';
      if (existingUser.username === username) message = 'Username already exists';
      if (existingUser.email === email) message = 'Email already exists';
      if (existingUser.username === username && existingUser.email === email) 
        message = 'Both username and email already exist';
      
      return Response.json(
        { success: false, message },
        { status: 400 }
      );
    }

    // Rest of your existing code...
    const newUser = new addUserModel({ username, email, password, DOB });
    const saveuser = await newUser.save();
    return Response.json({ success: true, data: saveuser });

  } catch (error) {
    console.error("Error saving user:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
