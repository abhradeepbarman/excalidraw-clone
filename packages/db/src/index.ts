import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chats, rooms, users } from "./schema";
import { chatRelations } from "./schema/chats";
import { roomRelations } from "./schema/rooms";
import { userRelations } from "./schema/users";
import config from "@repo/env-config/config";

const schema = {
    users,
    rooms,
    chats,

    userRelations,
    roomRelations,
    chatRelations,
};

const client = postgres(config.DB_URL || "");
const db = drizzle({ client, schema, logger: true });

export default db;
