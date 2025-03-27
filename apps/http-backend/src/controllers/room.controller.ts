import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { createRoomSchema } from "@repo/common/schema";
import db from "@repo/db";
import { rooms } from "@repo/db/schema";
import ResponseHandler from "../utils/ResponseHandler";

export const createRoom = asyncHandler(
    async (req: any, res: Response, next: NextFunction) => {
        const body = createRoomSchema.parse(req.body);
        const userId = req.user.id;

        const room = await db
            .insert(rooms)
            .values({
                admin_id: userId,
                slug: body.slug,
            })
            .returning();

        return res
            .status(201)
            .send(ResponseHandler(201, "Room created successfully", room));
    }
);
