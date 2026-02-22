import { and, desc, eq, gte, like, lt, or, sql } from "drizzle-orm";
import { db } from "../config/db.js";
import {
  actionTable,
  resetPasswordTokenTable,
  userLogs,
  userTable,
  verifyEmailTokenTable,
} from "../drizzle/schema.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendEmail } from "../lib/nodemailer.js";
import mjml2html from "mjml";
import path from "path";
import fs from "fs/promises";
import ejs from "ejs";
// import { sendEmail } from "../lib/resend-email.js";

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

export const getUserLogsById = (id) => {
  return db
    .select()
    .from(userLogs)
    .where(eq(userLogs.user_id, id))
    .orderBy(desc(userLogs.id));
};

export const getUserPendingLogsById = (id) => {
  return db
    .select()
    .from(userLogs)
    .where(and(eq(userLogs.user_id, id), eq(userLogs.status, "Pending")));
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
    .where(
      sql`
        WEEK(date, 0) = WEEK(CURDATE(), 0) AND YEAR(date) = YEAR(CURDATE())
      `,
    )
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

export const generateToken = ({ id, name, email, verifyEmail }) => {
  // console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
  return jwt.sign(
    { id, name, email, verifyEmail },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );
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

export const generateRandomToken = async (digit = 8) => {
  const min = 10 ** (digit - 1);

  const max = 10 ** digit;

  return crypto.randomInt(min, max).toString();
};

export const insertVerifyEmailToken = async ({ userId, token }) => {
  return db.transaction(async (tx) => {
    try {
      //Delete Expired Token
      await tx
        .delete(verifyEmailTokenTable)
        .where(lt(verifyEmailTokenTable.expiresAt, sql`CURRENT_TIMESTAMP`));

      //Delete User Token
      await tx
        .delete(verifyEmailTokenTable)
        .where(eq(verifyEmailTokenTable.userId, userId));

      //Insert New Token
      await tx.insert(verifyEmailTokenTable).values({ userId, token });
    } catch (error) {
      console.log(error);
    }
  });
};

export const createVerifyEmailLink = ({ email, token }) => {
  // const encodedEmail = encodeURIComponent(email);

  // return `http://localhost:3000/verify-email-token?email=${encodedEmail}&token=${token}`;

  const url = new URL(`${process.env.HOSTNAME}/verify-email-token`);

  url.searchParams.set("email", email);
  url.searchParams.set("token", token);

  return url.toString();
};

export const findVerificationEmailToken = async ({ token, email }) => {
  // console.log(`Token : ${token}`);
  // console.log(`Email : ${email}`);
  const tokenData = await db
    .select({
      userId: verifyEmailTokenTable.userId,
      token: verifyEmailTokenTable.token,
      expiresAt: verifyEmailTokenTable.expiresAt,
    })
    .from(verifyEmailTokenTable)
    .where(
      and(
        eq(verifyEmailTokenTable.token, token),
        gte(verifyEmailTokenTable.expiresAt, sql`CURRENT_TIMESTAMP`),
      ),
    );

  if (tokenData.length === 0) return null;

  // console.log(`Token data : ${tokenData}`);

  const { userId } = tokenData[0];

  // console.log(userId);

  const userData = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId));

  // console.log(userData);

  if (!userData.length) return null;

  return {
    userId: userData[0].userId,
    email: userData[0].email,
    token: tokenData[0].token,
    expiresAt: tokenData[0].expiresAt,
  };
};

export const verifyUserEmailAndUpdate = async (email) => {
  try {
    return db
      .update(userTable)
      .set({ isEmailValid: true })
      .where(eq(userTable.email, email));
  } catch (error) {
    console.log(error);
  }
};

export const clearVerifyEmailTokens = async (email) => {
  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    return await db
      .delete(verifyEmailTokenTable)
      .where(eq(verifyEmailTokenTable.userId, user.id));
  } catch (error) {
    console.log(error);
  }
};

export const newSendEmailVerification = async ({ userId, email }) => {
  const randomToken = await generateRandomToken();

  await insertVerifyEmailToken({ userId, token: randomToken });

  const verifyEmailLink = createVerifyEmailLink({
    email,
    token: randomToken,
  });

  const mjmlTemplate = await fs.readFile(
    path.join(import.meta.dirname, "..", "emails", "verify-email.mjml"),
    "utf-8",
  );

  const mjmlTemplateData = ejs.render(mjmlTemplate, {
    code: randomToken,
    link: verifyEmailLink,
  });

  const htmlOutput = mjml2html(mjmlTemplateData).html;

  const verifyURL = await sendEmail({
    to: email,
    subject: "Verify Your Email Address",
    html: htmlOutput,
  }).catch((err) => console.log(err));

  return verifyURL;
};

export const getForgetPasswordTemplate = async ({ name, link }) => {
  const mjmlTemplate = await fs.readFile(
    path.join(import.meta.dirname, "..", "emails", "forgot-password.mjml"),
    "utf-8",
  );

  const mjmlTemplateData = ejs.render(mjmlTemplate, {
    link,
    name,
  });

  const htmlOutput = mjml2html(mjmlTemplateData).html;

  return htmlOutput;
};

export const createResetPasswordLink = async ({ userId }) => {
  const randomToken = crypto.randomBytes(32).toString("hex");

  const hashRandomToken = crypto
    .createHash("sha256")
    .update(randomToken)
    .digest("hex");

  db.transaction(async (tx) => {
    await tx
      .delete(resetPasswordTokenTable)
      .where(eq(resetPasswordTokenTable.userId, userId));

    await tx
      .insert(resetPasswordTokenTable)
      .values({ userId, hashToken: hashRandomToken });
  });

  const resetPasswordLink = `${process.env.HOSTNAME}/reset-password/${hashRandomToken}`;

  return resetPasswordLink;
};

export const getUserByToken = (token) => {
  return db
    .select()
    .from(resetPasswordTokenTable)
    .where(eq(resetPasswordTokenTable.hashToken, token));
};

export const clearRestPasswordToken = (userId) => {
  return db
    .delete(resetPasswordTokenTable)
    .where(eq(resetPasswordTokenTable.userId, userId));
};

export const updatePassword = (userId, pass) => {
  return db
    .update(userTable)
    .set({ pass: pass }) // ✅ correct
    .where(eq(userTable.id, userId));
};

export const searchData = (search) => {
  return db
    .select()
    .from(userLogs)
    .where(
      or(
        like(userLogs.description, `%${search}%`),
        like(userLogs.reportedBy, `%${search}%`),
        like(userLogs.location, `%${search}%`),
        like(userLogs.action, `%${search}%`),
        like(userLogs.status, `%${search}%`),
      ),
    );
};
