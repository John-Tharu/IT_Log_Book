import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const userTable = mysqlTable("users_table", {
  id: int().autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  pass: varchar("pass", { length: 255 }).notNull(),
  isEmailValid: varchar("isEmailValid", { length: 255 })
    .notNull()
    .default("false"),
  role: varchar("role", { length: 255 }).notNull().default("User"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
});
