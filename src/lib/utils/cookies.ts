import { NextResponse } from "next/server";

const COOKIE_NAME = "__taskflow_token__";

export function setAuthCookie(response: NextResponse, token: string): NextResponse {
    response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
    });
    return response;
}

export function removeAuthCookie(response: NextResponse): NextResponse {
    response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
    return response;
}

export { COOKIE_NAME };