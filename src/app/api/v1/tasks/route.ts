import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { taskService } from "@/lib/services/task-service";
import { createTaskSchema } from "@/lib/validations/task.schema";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        let tasks;
        if (currentUser.user_type === "admin") {
            tasks = await taskService.getAllTasks();
        } else {
            tasks = await taskService.getTasksByUser(currentUser.id);
        }

        return NextResponse.json({ tasks }, { status: 200 });
    } catch (error) {
        console.error("Get tasks error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const result = createTaskSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const task = await taskService.createTask(currentUser.id, result.data);
        return NextResponse.json(
            { message: "Task created successfully", task },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create task error:-", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
