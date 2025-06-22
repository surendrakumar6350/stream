import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment extends Document {
    txnid: string;
    status: 'success' | 'failure' | 'pending';
    stream: Types.ObjectId;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
    {
        txnid: { type: String, required: true, unique: true },
        status: { type: String, enum: ['success', 'failure', 'pending'], required: true },
        stream: { type: Schema.Types.ObjectId, ref: 'Stream', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
    }
);

export const Payment =
    mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
