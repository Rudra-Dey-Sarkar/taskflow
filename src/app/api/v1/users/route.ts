import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { userService } from "@/lib/services/user-service";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Admin only
        if (currentUser.user_type !== "admin") {
            return NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            );
        }

        const users = await userService.getAllUsers();
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("Get users error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
