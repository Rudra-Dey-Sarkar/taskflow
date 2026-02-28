import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "24h";

export interface JwtPayload {
    id: string;
    email: string;
    user_type: "user" | "admin";
}

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

