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

export const userLogs = mysqlTable("user_logs", {
  id: int().autoincrement().primaryKey(),
  date: varchar("date", { length: 255 }).notNull(),
  time: varchar("time", { length: 255 }).notNull(),
  location: varchar("issue_location", { length: 255 }).notNull(),
  description: varchar("issue_description", { length: 255 }).notNull(),
  action: varchar("action_taken", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  user_id: int("user_id")
    .notNull()
    .references(() => userTable.id),
  solvedBy: int("solved_by").references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
});
