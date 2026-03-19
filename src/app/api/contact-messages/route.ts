import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    await initDb();
    const rows = await sql`SELECT * FROM contact_messages ORDER BY submitted_at DESC`;
    return NextResponse.json({ success: true, messages: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
