import config from "@repo/env-config/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function auth(req: any, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized",
        });
    }
}
