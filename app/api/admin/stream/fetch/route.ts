import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Stream } from "@/dbConnection/Schemas/stream";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'admin_secret_key';

export async function GET(): Promise<NextResponse> {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const token = cookieStore.get("admin")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token" }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const recentStreams = await Stream.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 30 },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants"
        }
      }
    ]);

    const transformedStreams = recentStreams.map((stream) => ({
      id: stream._id.toString(),
      title: stream.title,
      description: stream.description,
      host: stream.host,
      price: stream.price,
      status: stream.status,
      createdAt: stream.createdAt,
      participants: stream.participants.map((user: any) => ({
        id: user._id.toString(),
        name: user.name,
        upi: user.upi,
        joinedAt: user.date,
        mobile: user.mobile || null,
      }))
    }));

    return NextResponse.json({ success: true, streams: transformedStreams });
  } catch (error) {
    console.error("Error fetching recent streams:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
