import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { loginSchema, registerSchema } from "@repo/common/schema";
import db from "@repo/db";
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import CustomErrorHandler from "../utils/CustomErrorHandler";
import bcrypt from "bcryptjs";
import config from "@repo/env-config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import ResponseHandler from "../utils/ResponseHandler";

export const register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password } = registerSchema.parse(req.body);

        // Check if user already exists with this email
        const isExist = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (isExist) {
            return next(CustomErrorHandler.alreadyExist("User already exists"));
        }

        // Hash password
        const genSalt = await bcrypt.genSalt(Number(config.SALT));
        const hashedPassword = await bcrypt.hash(password, genSalt);

        // insert user
        const newUser = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
            })
            .returning();

        const payload: JwtPayload = { id: newUser[0]?.id };

        const accessToken = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: "7d",
        });

        await db
            .update(users)
            .set({
                refresh_token: refreshToken,
            })
            .where(eq(users.id, newUser[0]?.id!));

        // Send success response
        return res
            .status(201)
            .cookie("refresh_token", refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .cookie("access_token", accessToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 1000,
            })
            .send(
                ResponseHandler(201, "User registered successfully", {
                    id: newUser[0]?.id,
                    access_token: accessToken,
                })
            );
    }
);

export const login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = loginSchema.parse(req.body);

        // check if user exists
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            return next(CustomErrorHandler.notFound("User not found"));
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user?.password!
        );

        if (!isPasswordCorrect) {
            next(CustomErrorHandler.unAuthorized("Invalid credentials"));
        }

        // generate access, refresh token
        const payload: JwtPayload = { id: user.id };

        const accessToken = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: "7d",
        });

        await db
            .update(users)
            .set({
                refresh_token: refreshToken,
            })
            .where(eq(users.id, user?.id!));

        return res
            .status(200)
            .cookie("refresh_token", refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .cookie("access_token", accessToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: false,
                maxAge: 60 * 60 * 1000,
            })
            .send(
                ResponseHandler(200, "Login successful", {
                    id: user?.id,
                    access_token: accessToken,
                })
            );
    }
);
