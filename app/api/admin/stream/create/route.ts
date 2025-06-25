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
        const { price, host, title, description } = body;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized: No token" }, { status: 401 });
        }

        try {
            jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

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
