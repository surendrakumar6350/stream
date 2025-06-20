import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IStream extends Document {
    title: string;
    description?: string;
    host: string;
    price: number;
    status: "running" | "stopped" | "completed";
    participants: Types.ObjectId[];
    createdAt?: Date;
}

const streamSchema = new Schema<IStream>({
    title: { type: String, required: true },
    description: { type: String },
    host: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ["running", "stopped", "completed"],
        required: true,
        default: "running",
    },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

export const Stream: Model<IStream> =
    mongoose.models.Stream || mongoose.model<IStream>("Stream", streamSchema);
