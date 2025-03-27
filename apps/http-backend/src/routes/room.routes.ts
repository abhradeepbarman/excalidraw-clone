import { Router } from "express";
import { auth } from "../middlewares/auth";
import { createRoom } from "../controllers/room.controller";

const router: Router = Router();

router.post("/", auth, createRoom);

export default router;
