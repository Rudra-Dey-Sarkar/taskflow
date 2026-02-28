import { z } from "zod";

export const createTaskSchema = z.object({
    name: z
        .string()
        .min(1, "Task name is required")
        .max(255, "Task name must be at most 255 characters")
        .trim(),
    description: z
        .string()
        .max(5000, "Description must be at most 5000 characters")
        .default(""),
});

export const updateTaskSchema = z.object({
    name: z
        .string()
        .min(1, "Task name is required")
        .max(255, "Task name must be at most 255 characters")
        .trim()
        .optional(),
    description: z
        .string()
        .max(5000, "Description must be at most 5000 characters")
        .optional(),
    is_complete: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
