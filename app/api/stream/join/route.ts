import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDb } from "@/dbConnection/connect";
import { Stream } from "@/dbConnection/Schemas/stream";
import { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret_key";

export async function POST(request: Request): Promise<NextResponse> {
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

        const body = await request.json();
        const { streamId } = body;

        if (!streamId) {
            return NextResponse.json({ success: false, message: "Stream ID required" }, { status: 400 });
        }

        const stream = await Stream.findById(streamId);
        if (!stream) {
            return NextResponse.json({ success: false, message: "Stream not found" }, { status: 404 });
        }

        const objectId = new Types.ObjectId(userId);

        if (!stream.participants.some((id) => id.equals(objectId))) {
            stream.participants.push(objectId);
            await stream.save();
        }


        return NextResponse.json({ success: true, message: "Joined stream successfully" });
    } catch (error) {
        console.error("Join Stream Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
