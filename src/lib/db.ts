import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initDb() {
  const sql = getDb();
  // Contact messages table
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Add columns for existing tables
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'entreprise'`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS school VARCHAR(200) DEFAULT ''`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS added_manually BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS present_at TIMESTAMPTZ`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS email_status VARCHAR(50) DEFAULT 'pending'`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS email_provider VARCHAR(50) DEFAULT 'none'`;
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS email_error TEXT DEFAULT ''`;

  // Survey responses table
  await sql`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      answers JSONB NOT NULL,
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Add columns for existing tables if needed
}
