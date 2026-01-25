import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { userTable } from "../drizzle/schema.js";

export const checkemail = async (email) => {
  return await db.select().from(userTable).where(eq(userTable.email, email));
};
