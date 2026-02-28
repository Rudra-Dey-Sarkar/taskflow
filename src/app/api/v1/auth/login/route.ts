import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/user.schema";
import { userService } from "@/lib/services/user-service";
import { comparePassword } from "@/lib/utils/hash";
import { signToken } from "@/lib/utils/jwt";
import { setAuthCookie } from "@/lib/utils/cookies";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        // Find user by email
        const user = await userService.findByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Sign JWT
        const token = signToken({
            id: user.id,
            email: user.email,
            user_type: user.user_type,
        });

        // Set cookie and respond
        const response = NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    user_type: user.user_type,
                },
            },
            { status: 200 }
        );

        return setAuthCookie(response, token);
    } catch (error) {
        console.error("Login error:-", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
