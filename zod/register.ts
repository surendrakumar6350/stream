import { z } from "zod";
export const registerSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    mobile: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number")
        .trim(),
    upi: z
        .string()
        .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID")
        .trim(),
});