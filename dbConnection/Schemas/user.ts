import mongoose, { Schema, Model, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  mobile: string;
  upi: string;
  date?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  upi: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
