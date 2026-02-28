import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(255, "Name must be at most 255 characters")
        .trim(),
    email: z
        .string()
        .email("Invalid email address")
        .max(255, "Email must be at most 255 characters")
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be at most 100 characters"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
