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
      type VARCHAR(20) DEFAULT 'entreprise',
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      company VARCHAR(200) DEFAULT '',
      school VARCHAR(200) DEFAULT '',
      role VARCHAR(200) DEFAULT '',
      message TEXT DEFAULT '',
      registered_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Add columns for existing tables
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'entreprise'`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS school VARCHAR(200) DEFAULT ''`;
}
