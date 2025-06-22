import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Stream } from "@/dbConnection/Schemas/stream";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectDb();

        const body = await request.json();
        const { price, host, title, description } = body;

        if (!price || typeof price !== "number" || !host || !title || !description) {
            return NextResponse.json({ success: false, message: "Invalid or missing fields" }, { status: 400 });
        }

        const stream = await new Stream({
            title,
            description,
            host,
            price,
            status: "running",
            participants: []
        }).save();

        return NextResponse.json({ success: true, stream });
    } catch (error) {
        console.error("Error creating stream:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
