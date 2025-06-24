import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/zod/register";
import { connectDb } from "@/dbConnection/connect";
import { User } from "@/dbConnection/Schemas/user";
import { generateToken } from "@/utils/jwt";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectDb();
        const jsonBody = await request.json();

        // ✅ Validate using Zod
        const result = registerSchema.safeParse(jsonBody);
        if (!result.success) {
            const errorMsg = result.error.issues[0]?.message || "Invalid input";
            return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
        }

        const { name, mobile, upi } = result.data;

        let user = await User.findOne({ mobile });
        if (!user) {
            user = await new User({ name, mobile, upi }).save();
        }

        const token = generateToken({ _id: user._id });
        const response = NextResponse.json({ success: true });

        response.cookies.set("user", token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 4 * 24 * 60 * 60,
        });

        return response;
    } catch (error: any) {
        console.error("Error in user registration:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
