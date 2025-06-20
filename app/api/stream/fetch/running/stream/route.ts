import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDb } from "@/dbConnection/connect";
import { Stream } from "@/dbConnection/Schemas/stream";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret_key";

export async function GET(): Promise<NextResponse> {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const token = cookieStore.get("user")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token" }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      userId = decoded._id;
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const streams = await Stream.find({ status: "running" }).select("-__v");

    return NextResponse.json({ success: true, streams });
  } catch (error) {
    console.error("Get Streams Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
