import { z } from "zod";

const registerSchema = z.object({
    name: z
        .string({
            message: "Name is required",
        })
        .min(1),
    email: z
        .string({
            message: "Email is required",
        })
        .email({
            message: "Invalid email",
        }),
    password: z
        .string({
            message: "Password is required",
        })
        .min(6, {
            message: "Password must be at least 6 characters",
        }),
});

export default registerSchema;