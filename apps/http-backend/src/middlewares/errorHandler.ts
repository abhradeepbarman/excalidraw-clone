import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { formatError } from "../service/formatError";
import CustomErrorHandler from "../utils/CustomErrorHandler";
import ResponseHandler from "../utils/ResponseHandler";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    let statusCode = 500;
    let errData = {
        message: "Internal Server Error",
    };

    if (err instanceof ZodError) {
        statusCode = 422;
        errData = {
            message: formatError(err),
        };
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        errData = err.toJson();
    }

    console.error(err);

    return res
        .status(statusCode)
        .send(ResponseHandler(statusCode, errData.message));
};

export default errorHandler;
