import { desc, eq, sql } from "drizzle-orm";
import { db } from "../config/db.js";
import { actionTable, userLogs, userTable } from "../drizzle/schema.js";
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
  return db
    .select({
      id: userLogs.id,
      date: userLogs.date,
      time: userLogs.time,
      reportedBy: userLogs.reportedBy,
      location: userLogs.location,
      description: userLogs.description,
      action: userLogs.action,
      status: userLogs.status,
      solvedBy: userLogs.solvedBy,
      userName: userTable.name,
      createdAt: userLogs.createdAt,
    })
    .from(userLogs)
    .leftJoin(userTable, eq(userLogs.user_id, userTable.id))
    .where(eq(userLogs.id, id));
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
  // console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export const editLogs = ({
  id,
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
  return db
    .update(userLogs)
    .set({
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
    .where(eq(userLogs.id, id));
};

export const addAnotherAction = async ({ id, action, status, userId }) => {
  // console.log(id, action, status, userId);
  await db.transaction(async (tx) => {
    await tx.insert(actionTable).values({ logId: id, action, userId });

    await tx
      .update(userLogs)
      .set({ status, solvedBy: userId })
      .where(eq(userLogs.id, id));
  });
};

export const getMessages = (id) => {
  return db
    .select({
      id: actionTable.id,
      action: actionTable.action,
      createdAt: actionTable.createdAt,
      userId: actionTable.userId,
      userName: userTable.name,
    })
    .from(actionTable)
    .leftJoin(userTable, eq(actionTable.userId, userTable.id))
    .where(eq(actionTable.logId, id));
};
