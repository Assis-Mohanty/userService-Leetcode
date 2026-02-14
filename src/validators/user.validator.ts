import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(100),
})

export const updateUserSchema = z.object({
    username: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(100).optional(),
    profile: z.object({
        name: z.string().min(1).max(50).optional(),
        bio: z.string().max(200).optional()
    }).optional(),
    rating: z.number().min(0).max(5).optional(),
    role: z.enum(["user", "admin"]).optional(),
})