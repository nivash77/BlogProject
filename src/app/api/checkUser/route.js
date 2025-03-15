import addUserModel from "../../../../Model/AddUser";
import { ConnectMongodb } from "../../../utils/ConnectMongodb";

export async function POST(req) {
  try {
    await ConnectMongodb();

    const { username, password } = await req.json();
    const user = await addUserModel
      .findOne({ username })
      .select("+password")
      .orFail(() => {
        throw new Error("Invalid username or password");
      });
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return Response.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }
    return Response.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return Response.json(
      {
        success: false,
        message: error.message.startsWith("Invalid")
          ? "Invalid username or password"
          : "Internal server error",
      },
      { status: 500 }
    );
  }
}
