import { WebSocketServer } from "ws";
import config from "@repo/env-config/config";
import jwt from "jsonwebtoken"

const wss = new WebSocketServer({ port: Number(config.PORT) });

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token");
    if(!token) return;

    const decoded = jwt.verify(token, config.JWT_SECRET);
    if(!decoded) {
        ws.close();
        return;
    }


    console.log("Client connected");
    ws.on("error", console.error);

    ws.on("message", function message(data) {
        console.log("received: %s", data);
    });
});
