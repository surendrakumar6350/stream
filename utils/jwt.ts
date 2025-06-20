import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}
