import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      company VARCHAR(200) DEFAULT '',
      role VARCHAR(200) DEFAULT '',
      message TEXT DEFAULT '',
      registered_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
