import { cookies } from "next/headers";
import { verifyToken, JwtPayload } from "./jwt";
import { COOKIE_NAME } from "./cookies";

export async function getCurrentUser(): Promise<JwtPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    return verifyToken(token);
}
