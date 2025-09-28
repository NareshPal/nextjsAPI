import { promises as fs } from "fs";
import path from "path";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from "@/app/models/User";

export async function POST(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // write file locally
    await fs.writeFile(filePath, buffer);

    const dbPath = `/uploads/${fileName}`;

    // update user with image path
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { profileImage: dbPath } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Image uploaded successfully",
      imageUrl: dbPath,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
