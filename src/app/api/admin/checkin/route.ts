import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

type CheckinAction = "checkin" | "uncheckin" | "manual-add";

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const adminToken = process.env.ADMIN_TOKEN || "digizelle-admin-2026";
  return authHeader === `Bearer ${adminToken}`;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildManualEmail(firstName: string, lastName: string): string {
  const cleanFirst = firstName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "") || "invite";
  const cleanLast = lastName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "") || "manuel";

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return `${cleanFirst}.${cleanLast}.${suffix}@manual.digizelle.local`;
}

function mapRegistration(row: any) {
  return {
    id: row.id,
    type: row.type || "entreprise",
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    company: row.company || "",
    school: row.school || "",
    role: row.role || "",
    message: row.message || "",
    emailStatus: row.email_status || "pending",
    emailProvider: row.email_provider || "none",
    emailError: row.email_error || "",
    registeredAt: row.registered_at,
    addedManually: Boolean(row.added_manually),
    presentAt: row.present_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const sql = getDb();
    await initDb();

    const rows = await sql`
      SELECT id, type, first_name, last_name, email, company, school, role, message,
             email_status, email_provider, email_error, registered_at, added_manually, present_at
      FROM registrations
      ORDER BY registered_at DESC
    `;

    return NextResponse.json({
      success: true,
      registrations: rows.map(mapRegistration),
    });
  } catch (error) {
    console.error("[Admin-Checkin][GET] Error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const sql = getDb();
    await initDb();

    const body = await req.json();
    const action = body?.action as CheckinAction;

    if (action === "checkin") {
      const id = String(body?.id || "").trim();
      if (!id) {
        return NextResponse.json({ success: false, error: "ID requis" }, { status: 400 });
      }

      const updated = await sql`
        UPDATE registrations
        SET present_at = COALESCE(present_at, NOW())
        WHERE id = ${id}
        RETURNING id, type, first_name, last_name, email, company, school, role, message,
                  email_status, email_provider, email_error, registered_at, added_manually, present_at
      `;

      if (updated.length === 0) {
        return NextResponse.json({ success: false, error: "Invité introuvable" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: "Présence validée.",
        registration: mapRegistration(updated[0]),
      });
    }

    if (action === "uncheckin") {
      const id = String(body?.id || "").trim();
      if (!id) {
        return NextResponse.json({ success: false, error: "ID requis" }, { status: 400 });
      }

      const updated = await sql`
        UPDATE registrations
        SET present_at = NULL
        WHERE id = ${id}
        RETURNING id, type, first_name, last_name, email, company, school, role, message,
                  email_status, email_provider, email_error, registered_at, added_manually, present_at
      `;

      if (updated.length === 0) {
        return NextResponse.json({ success: false, error: "Invité introuvable" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: "Présence annulée.",
        registration: mapRegistration(updated[0]),
      });
    }

    if (action === "manual-add") {
      const firstName = String(body?.firstName || "").trim();
      const lastName = String(body?.lastName || "").trim();
      const type = body?.type === "etudiant" ? "etudiant" : "entreprise";
      const company = String(body?.company || "").trim();
      const school = String(body?.school || "").trim();
      const role = String(body?.role || "").trim();
      const message = String(body?.message || "").trim();

      if (firstName.length < 2 || lastName.length < 2) {
        return NextResponse.json(
          { success: false, error: "Prénom et nom requis (min. 2 caractères)." },
          { status: 400 }
        );
      }

      const providedEmail = String(body?.email || "").trim().toLowerCase();
      if (providedEmail && !validateEmail(providedEmail)) {
        return NextResponse.json({ success: false, error: "Email invalide." }, { status: 400 });
      }

      const email = providedEmail || buildManualEmail(firstName, lastName);

      const existing = await sql`SELECT id FROM registrations WHERE email = ${email}`;
      if (existing.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Un invité avec cet email existe déjà. Utilise la recherche puis valide sa présence.",
          },
          { status: 409 }
        );
      }

      const inserted = await sql`
        INSERT INTO registrations (
          type, first_name, last_name, email, company, school, role, message,
          added_manually, present_at, email_status, email_provider, email_error
        )
        VALUES (
          ${type}, ${firstName}, ${lastName}, ${email}, ${company}, ${school}, ${role}, ${message},
          TRUE, NOW(), 'manual', 'manual', ''
        )
        RETURNING id, type, first_name, last_name, email, company, school, role, message,
                  email_status, email_provider, email_error, registered_at, added_manually, present_at
      `;

      return NextResponse.json({
        success: true,
        message: "Invité ajouté manuellement et marqué présent.",
        registration: mapRegistration(inserted[0]),
      });
    }

    return NextResponse.json({ success: false, error: "Action non supportée" }, { status: 400 });
  } catch (error) {
    console.error("[Admin-Checkin][POST] Error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
