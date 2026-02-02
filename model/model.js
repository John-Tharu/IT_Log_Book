import { desc, eq, sql } from "drizzle-orm";
import { db } from "../config/db.js";
import { userLogs, userTable } from "../drizzle/schema.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const checkemail = async (email) => {
  return await db.select().from(userTable).where(eq(userTable.email, email));
};

export const hashpass = async (pass) => {
  return await argon2.hash(pass);
};

export const addUser = ({ email, name, pass }) => {
  return db.insert(userTable).values({ email, name, pass }).$returningId();
};

export const checkEmail = (email) => {
  return db.select().from(userTable).where(eq(userTable.email, email));
};

export const checkPass = async (pass, hash) => {
  return await argon2.verify(hash, pass);
};

export const addLogs = async ({
  date,
  time,
  reportedBy,
  location,
  description,
  action,
  status,
  userId,
  solvedBy,
}) => {
  return await db
    .insert(userLogs)
    .values({
      date,
      time,
      reportedBy,
      location,
      description,
      action,
      status,
      user_id: userId,
      solvedBy,
    })
    .$returningId();
};

export const getUserLogs = () => {
  return db.select().from(userLogs).orderBy(desc(userLogs.id));
};

export const getLogs = (id) => {
  return db.select().from(userLogs).where(eq(userLogs.id, id));
};

export const getUserPendingLogs = () => {
  return db
    .select()
    .from(userLogs)
    .where(eq(userLogs.status, "Pending"))
    .orderBy(desc(userLogs.id));
};

export const getThisWeekLog = () => {
  return db
    .select()
    .from(userLogs)
    .where(sql`date >= CURDATE() - INTERVAL 7 DAY`)
    .orderBy(desc(userLogs.id));
};

export const getSolvedLogs = () => {
  return db
    .select()
    .from(userLogs)
    .where(eq(userLogs.status, "Solved"))
    .orderBy(desc(userLogs.id));
};

export const getUserById = (id) => {
  return db.select().from(userTable).where(eq(userTable.id, id));
};

export const generateToken = ({ id, name, email }) => {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
