import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { User } from "@/dbConnection/Schemas/user";
import { generateToken } from "@/utils/jwt";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectDb();

        const body = await request.json();
        const { name, mobile, upi } = body;

        if (!name || !mobile || !upi) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        let user = await User.findOne({ mobile });

        if (!user) {
            user = await new User({ name, mobile, upi }).save();
        }

        const token = generateToken({ _id: user._id });

        const response = NextResponse.json({ success: true });
        response.cookies.set("user", token, {
            expires: new Date(Date.now() * 160),
            path: "/",
        });
        return response;
    } catch (error) {
        console.error("Error in user registration:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
