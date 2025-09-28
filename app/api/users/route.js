import connectDB from "@/config/database";
import User from "@/app/models/User";
import bcrypt from "bcrypt";
import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // disable default JSON parsing for file uploads
  },
};



export async function GET(req) {
  await connectDB();
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return Response.json({total_users:users.length, users}, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong", details: error.message }, 
      { status: 500 }
    );
  }
}

// export async function POST(req) {
//   await connectDB();
//   const { email, username, password } = await req.json();

//   const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

  
//    try {
//     const newUser = await User.create({ email, username, password:hashedPassword });
//     return Response.json(newUser, { status: 201 });
//   } catch (error) {
//     if (error.code === 11000) {
//       return Response.json(
//         { error: "Email already exists" },
//         { status: 400 }
//       );
//     }
//     return Response.json(
//       { error: "Something went wrong", details: error.message },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const file = formData.get("file"); // optional profile image

    if (!email || !username || !password) {
      return new Response(
        JSON.stringify({ error: "Email, username and password are required" }),
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle image upload if provided
    let profileImagePath = "/uploads/default.png"; // default fallback

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      profileImagePath = `/uploads/${fileName}`;
    }

    // Create user in MongoDB
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      profileImage: profileImagePath,
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({ error: "Something went wrong", details: error.message }),
      { status: 500 }
    );
  }
}
