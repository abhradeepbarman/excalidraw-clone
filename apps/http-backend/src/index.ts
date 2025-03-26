import express from "express";
import config from "@repo/env-config/config";
import authRoutes from "./routes/auth.routes";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/auth", authRoutes);

const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`http-backend listening on port ${PORT}`);
});
