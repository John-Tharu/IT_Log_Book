import { sql } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const verifyEmailTokenTable = mysqlTable("verify_email_token", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 8 }).notNull(),
  expiresAt: timestamp("expires_at")
    .default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 DAY)`)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userTable = mysqlTable("users_table", {
  id: int().autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  pass: varchar("pass", { length: 255 }).notNull(),
  avatar: text("avatar"),
  isEmailValid: boolean("is_email_valid").default(false).notNull(),
  role: varchar("role", { length: 255 }).notNull().default("User"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
});

export const userLogs = mysqlTable("user_logs", {
  id: int().autoincrement().primaryKey(),
  date: varchar("date", { length: 255 }).notNull(),
  time: varchar("time", { length: 255 }).notNull(),
  reportedBy: varchar("reported_by", { length: 255 }).notNull(),
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

export const actionTable = mysqlTable("actions_table", {
  id: int().autoincrement().primaryKey(),

  logId: int("log_id")
    .notNull()
    .references(() => userLogs.id, { onDelete: "cascade" }),

  action: varchar("action", { length: 100 }).notNull(),

  userId: int("user_id")
    .notNull()
    .references(() => userTable.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const resetPasswordTokenTable = mysqlTable("reset_password_token", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  hashToken: text("hash_token").notNull(),
  expiresAt: timestamp("expires_at")
    .default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 DAY)`)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
