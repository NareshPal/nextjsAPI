import connectDB from "@/config/database";
import User from "@/app/models/User";

import bcrypt from "bcrypt";

export async function GET(req) {
  await connectDB();
  try {
    const users = await User.find({});
    return Response.json({total_users:users.length, users}, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong", details: error.message }, 
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();
  const { email, username, password } = await req.json();

  const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

  
   try {
    const newUser = await User.create({ email, username, password:hashedPassword });
    return Response.json(newUser, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return Response.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return Response.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
