import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/zod/adminLogin";
import { generateToken } from "@/utils/jwt";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "supersecureadmin";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { password } = parsed.data;

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { success: false, message: "Invalid admin password" },
                { status: 401 }
            );
        }


        const token = generateToken({ role: "admin" });

        const response = NextResponse.json({ success: true, message: "Admin authenticated" });

        response.cookies.set("admin", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60,
        });

        return response;
    } catch (err) {
        console.error("Admin login error:", err);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
