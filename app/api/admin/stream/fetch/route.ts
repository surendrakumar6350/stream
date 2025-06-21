import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Stream } from "@/dbConnection/Schemas/stream";

export async function GET(): Promise<NextResponse> {
  try {
    await connectDb();

    const recentStreams = await Stream.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
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
