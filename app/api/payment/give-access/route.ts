import { NextRequest, NextResponse } from 'next/server';
import payuClient from '../config';
import { connectDb } from '@/dbConnection/connect';
import { Payment } from '@/dbConnection/Schemas/payment';
import { Stream } from '@/dbConnection/Schemas/stream';
import { Types } from "mongoose";
import { generateHtml } from '../config';

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const formData = await request.formData();
    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const txnid = data.txnid;

    if (!txnid) {
      return new NextResponse(generateHtml("Transaction ID not found"), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    try {
      const verification = await payuClient.verifyPayment(txnid);

      const transaction = verification?.transaction_details?.[txnid];

      if (!transaction) {
        return new NextResponse(generateHtml("Transaction details not found from PayU"), {
          headers: { 'Content-Type': 'text/html' }
        });
      }

      const isSuccess = transaction.status === 'success' && transaction.unmappedstatus === 'captured';

      const payment = await Payment.findOne({ txnid });

      if (!payment) {
        return new NextResponse(generateHtml("No local payment record found"), {
          headers: { 'Content-Type': 'text/html' }
        });
      }

      if (payment.status === 'success') {
        return new NextResponse(generateHtml("Payment already marked as successful"), {
          headers: { 'Content-Type': 'text/html' }
        });
      }

      if (isSuccess) {
        payment.status = 'success';
        await payment.save();

        const stream = await Stream.findById(payment.stream);
        if (!stream) {
          return new NextResponse(generateHtml("Stream not found"), {
            headers: { 'Content-Type': 'text/html' }
          });
        }

        if (stream.status != "running") {
          return new NextResponse(generateHtml("Stream is No longer Running, You are not able to Join, For a refund email us: node.index.json@gmail.com"), {
            headers: { 'Content-Type': 'text/html' }
          });
        }

        const objectId = new Types.ObjectId(payment.user);

        if (!stream.participants.some((id) => id.equals(objectId))) {
          stream.participants.push(objectId);
          await stream.save();
        }

        return NextResponse.redirect(new URL("/", request.url), 302);

      } else {
        // Mark payment as failed
        payment.status = 'failure';
        await payment.save();

        return NextResponse.redirect(new URL("/", request.url), 302);
      }

    } catch (err) {
      return new NextResponse(generateHtml("Payment verification failed"), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

  } catch (error) {
    console.error('Failed to parse form data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to parse form data' },
      { status: 400 }
    );
  }
}
