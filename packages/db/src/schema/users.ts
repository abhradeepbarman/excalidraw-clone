import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const users = pgTable("users", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export default users;
