import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/auth";
import { taskService } from "@/lib/services/task-service";
import { updateTaskSchema } from "@/lib/validations/task.schema";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                { error: "Invalid task ID format" },
                { status: 400 }
            );
        }

        const task = await taskService.getTaskById(id);
        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        // Check ownership
        if (currentUser.user_type !== "admin" && task.user_id !== currentUser.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.json({ task }, { status: 200 });
    } catch (error) {
        console.error("Get task error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                { error: "Invalid task ID format" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const result = updateTaskSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const task = await taskService.updateTask(
            id,
            result.data,
            currentUser.id,
            currentUser.user_type === "admin"
        );

        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Task updated successfully", task },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return NextResponse.json(
                { error: "Forbidden: You can only modify your own tasks" },
                { status: 403 }
            );
        }
        console.error("Update task error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                { error: "Invalid task ID format" },
                { status: 400 }
            );
        }

        const deleted = await taskService.deleteTask(
            id,
            currentUser.id,
            currentUser.user_type === "admin"
        );

        if (!deleted) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Task deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return NextResponse.json(
                { error: "Forbidden: You can only delete your own tasks" },
                { status: 403 }
            );
        }
        console.error("Delete task error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
