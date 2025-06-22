import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "@/dbConnection/Schemas/user";
import { Stream } from "@/dbConnection/Schemas/stream";
import { BASE_URL } from "@/constants";
import { v4 as uuidv4 } from 'uuid';
import payuClient from "../config";
import { Payment } from "@/dbConnection/Schemas/payment";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret_key";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {

        await connectDb();
        const searchParams = request.nextUrl.searchParams;
        const streamId = searchParams.get('streamId');

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

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid User" }, { status: 401 });
        }

        const stream = await Stream.findById(streamId);

        if (!stream) {
            return NextResponse.json({ success: false, message: "Invalid Stream" }, { status: 401 });
        }

        if (stream.status != "running") {
            return NextResponse.json({ success: false, message: "Stream is no longer Running" }, { status: 400 });
        }

        const existing = await Payment.findOne({
            user: userId,
            stream: streamId,
            status: { $in: ['success'] }
        });

        if (existing) {
            return NextResponse.json({
                success: false,
                message: "Payment already initiated or completed for this stream."
            }, { status: 409 });
        }

        const tnx = {
            txnid: `TXN${Date.now()}${uuidv4().replace(/-/g, '').slice(0, 20)}`,
            amount: stream.price,
            firstname: user.name,
            productinfo: "payu",
            email: "node.index.json@gmail.com",
            phone: user.mobile,
            surl: `${BASE_URL}/api/payment/give-access`,
            furl: `${BASE_URL}/api/payment/give-access`
        }

        const data = await payuClient.paymentInitiate(tnx);

        await Payment.create({
            txnid: tnx.txnid,
            status: "pending",
            user: userId,
            stream: streamId
        });

        return NextResponse.json({
            success: true,
            res: data
        })

    } catch (error) {
        console.error("Error in user registration:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error", error: error }, { status: 500 });
    }
}
