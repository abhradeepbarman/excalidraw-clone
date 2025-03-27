import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import users from "./users";
import chats from "./chats";

const rooms = pgTable("rooms", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    slug: varchar("slug").notNull().unique(),
    admin_id: uuid("admin_id")
        .notNull()
        .references(() => users.id),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const roomRelations = relations(rooms, ({ one, many }) => ({
    admin: one(users, {
        fields: [rooms.admin_id],
        references: [users.id],
    }),
    chats: many(chats),
}));

export default rooms;
