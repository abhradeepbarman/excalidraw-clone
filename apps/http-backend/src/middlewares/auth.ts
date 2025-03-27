import config from "@repo/env-config/config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import CustomErrorHandler from "../utils/CustomErrorHandler";

export const auth = asyncHandler(
    async (req: any, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            next(CustomErrorHandler.unAuthorized("Unauthorized Access"));
        }

        const token = authHeader?.split(" ")[1];

        const user = jwt.verify(token!, config.JWT_SECRET);
        if (!user) {
            next(CustomErrorHandler.unAuthorized("Unauthorized Access"));
        }
        req.user = user;
        next();
    }
);
