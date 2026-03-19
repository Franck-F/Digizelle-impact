import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    await initDb();
    const body = await req.json();
    // Expecting { answers: {...} }
    if (!body.answers || typeof body.answers !== "object") {
      return NextResponse.json({ success: false, error: "Réponses invalides" }, { status: 400 });
    }
    await sql`INSERT INTO survey_responses (answers) VALUES (${JSON.stringify(body.answers)})`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = getDb();
    await initDb();
    const rows = await sql`SELECT * FROM survey_responses ORDER BY submitted_at DESC`;
    return NextResponse.json({ success: true, responses: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
