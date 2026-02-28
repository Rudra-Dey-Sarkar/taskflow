import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/utils/jwt";

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );
        return removeAuthCookie(response);
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
