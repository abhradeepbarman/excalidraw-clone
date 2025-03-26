import config from "@repo/env-config/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/schema",
    out: "./src/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: config.DB_URL,
    },
});
