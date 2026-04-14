import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function query<T extends Record<string, any> = Record<string, any>>(text: string, params?: any[]) {
  const res = await pool.query<T>(text, params);
  return res;
}

export { pool };