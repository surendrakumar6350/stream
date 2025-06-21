import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Stream } from "@/dbConnection/Schemas/stream";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await connectDb();

    const body = await request.json();
    const { streamId, newStatus } = body;

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
