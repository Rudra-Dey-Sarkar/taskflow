import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET
);
const COOKIE_NAME = "__taskflow_token__";

interface TokenPayload {
    id: string;
    email: string;
    user_type: "user" | "admin";
}

async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as TokenPayload;
    } catch {
        return null;
    }
}

// admin only
const ADMIN_PATHS = ["/admin"];

// unauthenticated users
const AUTH_PATHS = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(COOKIE_NAME)?.value;

    const user = token ? await verifyTokenEdge(token) : null;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Public API routes
    if (
        pathname === "/api/v1/auth/register" ||
        pathname === "/api/v1/auth/login"
    ) {
        return NextResponse.next();
    }

    // Protected API routes
    if (pathname.startsWith("/api/")) {
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Admin API routes
        if (pathname.startsWith("/api/v1/users") && user.user_type !== "admin") {
            return NextResponse.json(
                { error: "Forbidden:- Admin access required" },
                { status: 403 }
            );
        }

        return NextResponse.next();
    }

    // logged in users
    if (user && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
        const redirectPath = user.user_type === "admin" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Public pages
    if (pathname === "/") {
        if (user) {
            const redirectPath = user.user_type === "admin" ? "/admin" : "/dashboard";
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
        return NextResponse.next();
    }

    // Admin pages
    if (user && ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
        if (user.user_type !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
