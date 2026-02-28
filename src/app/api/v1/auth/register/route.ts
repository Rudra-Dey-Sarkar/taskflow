import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/user.schema";
import { userService } from "@/lib/services/user-service";
import { hashPassword } from "@/lib/utils/hash";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // Check if user already exists
        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: "A user with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password and create user
        const hashedPassword = await hashPassword(password);
        const user = await userService.createUser({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            {
                message: "User registered successfully",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
