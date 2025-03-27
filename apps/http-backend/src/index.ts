import express, { NextFunction, Request, Response } from "express";
import config from "@repo/env-config/config";
import authRoutes from "./routes/auth.routes";
import roomRoutes from "./routes/room.routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/room", roomRoutes);

/* ----------------404 not found---------------- */
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 404,
        message: "404 not found",
    });
});

/* -------------------Custom Middleware------------------- */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`http-backend listening on port ${PORT}`);
});
