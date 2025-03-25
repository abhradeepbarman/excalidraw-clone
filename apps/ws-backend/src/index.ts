import { WebSocketServer } from "ws";
import config from "@repo/env-config/config"

const wss = new WebSocketServer({ port: Number(config.PORT) });

wss.on("connection", function connection(ws) {
    console.log("Client connected");
    ws.on("error", console.error);

    ws.on("message", function message(data) {
        console.log("received: %s", data);
    });
});
