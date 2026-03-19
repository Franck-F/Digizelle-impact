
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
import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    await initDb();
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body;
    if (!email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Champs requis manquants" }, { status: 400 });
    }
    // Save contact message in DB
    await sql`INSERT INTO contact_messages (first_name, last_name, email, subject, message, submitted_at) VALUES (${firstName}, ${lastName}, ${email}, ${subject}, ${message}, NOW())`;
    // Send email to contact@digizelle.fr
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: `Digizelle Contact <${process.env.SMTP_USER}>`,
      to: "contact@digizelle.fr",
      subject: `[Contact] ${subject}`,
      html: `<p><strong>De :</strong> ${firstName} ${lastName} (${email})</p><p><strong>Sujet :</strong> ${subject}</p><p><strong>Message :</strong><br/>${message}</p>`
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
