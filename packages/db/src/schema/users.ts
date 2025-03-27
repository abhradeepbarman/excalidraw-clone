import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import rooms from "./rooms";
import chats from "./chats";

const users = pgTable("users", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    avatar: varchar("avatar"),
    refresh_token: varchar("refresh_token"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ one, many }) => ({
    rooms: many(rooms),
    chats: many(chats),
}));

export default users;
