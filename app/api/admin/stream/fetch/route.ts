import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Stream } from "@/dbConnection/Schemas/stream";

export async function GET(): Promise<NextResponse> {
  try {
    await connectDb();

    const recentStreams = await Stream.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const transformedStreams = recentStreams.map((stream) => ({
      ...stream,
      id: stream._id.toString(),
      _id: undefined,
      participants: stream.participants
        .filter((user: any) => user)
        .map((user: any) => {
          const { _id, date, ...rest } = user;
          return {
            ...rest,
            id: _id.toString(),
            joinedAt: date,
          };
        }),
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
