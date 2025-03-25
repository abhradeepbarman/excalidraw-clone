import express from "express";
import config from "@repo/env-config/config"

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from http-backend!");
});

const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`http-backend listening on port ${PORT}`);
});
