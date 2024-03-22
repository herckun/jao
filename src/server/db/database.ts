import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
const DATABASE_URL = import.meta.env.DATABASE_URL;

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

export default db;
