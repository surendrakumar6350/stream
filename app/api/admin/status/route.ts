import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Stream } from "@/dbConnection/Schemas/stream";
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'admin_secret_key';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const token = cookieStore.get("admin")?.value;

    const body = await request.json();
    const { streamId, newStatus } = body;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token" }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // Validate inputs
    if (!streamId || !newStatus || !['running', 'stopped', 'completed'].includes(newStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid streamId or status" },
        { status: 400 }
      );
    }

    const updated = await Stream.findByIdAndUpdate(
      streamId,
      { status: newStatus },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Stream not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      stream: {
        ...updated,
        id: updated._id.toString(),
        _id: undefined,
      },
    });
  } catch (error) {
    console.error("Error updating stream status:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
