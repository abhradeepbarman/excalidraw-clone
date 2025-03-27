import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import rooms from "./rooms";
import users from "./users";
import { relations } from "drizzle-orm";

const chats = pgTable("chats", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    room_id: uuid("room_id")
        .notNull()
        .references(() => rooms.id),
    user_id: uuid("user_id").notNull(),
    message: varchar("message").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const chatRelations = relations(chats, ({ one }) => ({
    room: one(rooms, {
        fields: [chats.room_id],
        references: [rooms.id],
    }),
    user: one(users, {
        fields: [chats.user_id],
        references: [users.id],
    }),
}));

export default chats;
