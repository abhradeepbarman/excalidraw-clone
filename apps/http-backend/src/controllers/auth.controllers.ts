import { NextFunction, Request, Response } from "express";
import db from "@repo/db";
import { eq } from "drizzle-orm";
import { users } from "@repo/db/schema";
import jwt from "jsonwebtoken";
import config from "@repo/env-config/config";
import { registerSchema } from "@repo/common/schema";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = registerSchema.parse(req.body);

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, data.email),
        });

        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "User already exists",
            });
        }

        const user = await db
            .insert(users)
            .values({
                email: data.email,
                name: data.name,
                password: data.password,
            })
            .returning();

        // generate token
        const token = jwt.sign(
            {
                id: user[0]?.id,
            },
            config.JWT_SECRET
        );

        return res.status(201).json({
            status: true,
            message: "User created successfully",
            data: {
                user: user[0],
                token,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
};

export const login = async () => {
    try {
    } catch (error) {}
};
