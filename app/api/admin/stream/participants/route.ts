import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/dbConnection/connect';
import { Stream } from '@/dbConnection/Schemas/stream';
import { User } from '@/dbConnection/Schemas/user';
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'admin_secret_key';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const cookieStore = await cookies();
    const token = cookieStore.get("admin")?.value;

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Invalid stream ID" }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token" }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const stream = await Stream.findById(id).lean();

    if (!stream) {
      return NextResponse.json({ success: false, message: "Stream not found" }, { status: 404 });
    }

    // participants are array of ObjectId
    const userIds = stream.participants || [];

    const users = await User.find({ _id: { $in: userIds } }).lean();

    // Optionally attach to stream object
    const enrichedStream = {
      ...stream,
      id: stream._id.toString(),
      participants: users.map((user: any) => ({
        ...user,
        id: user._id.toString(),
        joinedAt: user.date,
        _id: undefined,
        __v: undefined,
        date: undefined
      }))
    };

    return NextResponse.json({ success: true, stream: enrichedStream });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
