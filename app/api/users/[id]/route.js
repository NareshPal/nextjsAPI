import connectDB from "@/config/database";
import User from "@/app/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

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

  try {
    const { id } = params;

    // Find user first
    const user = await User.findById(id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // If user has a profile image and it's not the default, delete it
    if (user.profileImage && user.profileImage !== "/uploads/default.png") {
      const filePath = path.join(process.cwd(), "public", user.profileImage);

      try {
        await fs.unlink(filePath); // delete the image file
        console.log("Deleted file:", filePath);
      } catch (err) {
        console.warn("Could not delete file:", filePath, err.message);
      }
    }

    // Delete user from DB
    await User.findByIdAndDelete(id);

    return Response.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

