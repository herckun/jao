import type { Config } from "drizzle-kit";
import { loadEnv } from "vite";
const { DATABASE_URL } = loadEnv(
  process.env.DATABASE_URL as string,
  process.cwd(),
  ""
);
export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL as string,
  },
} satisfies Config;
