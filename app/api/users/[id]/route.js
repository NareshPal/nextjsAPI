import connectDB from "@/config/database";
import User from "@/app/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  await connectDB();

  const { id } = params; // extract id from URL
  const { username, password } = await req.json();

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    // Build update object
    const updateData = {};
    if (username) updateData.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // return updated user
    );

    if (!updatedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await connectDB();    
    const { id } = params; // extract id from URL
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }   
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }
        return Response.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        return Response.json(
            { error: "Something went wrong", details: error.message },
            { status: 500 }
        );
    }   
}

