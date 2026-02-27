import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

const MAX_CAPACITY = 50;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    await initDb();

    const body = await req.json();
    const { type, firstName, lastName, email, company, school, role, message } = body;

    const profileType = type === "etudiant" ? "etudiant" : "entreprise";

    // Validation
    const errors: string[] = [];
    if (!firstName || typeof firstName !== "string" || firstName.trim().length < 2) {
      errors.push("Le prénom est requis (min. 2 caractères).");
    }
    if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
      errors.push("Le nom est requis (min. 2 caractères).");
    }
    if (!email || !validateEmail(email)) {
      errors.push("Un email valide est requis.");
    }
    if (profileType === "etudiant" && (!school || typeof school !== "string" || school.trim().length < 2)) {
      errors.push("L'école / université est requise.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check for duplicate email
    const existing = await sql`SELECT id FROM registrations WHERE email = ${cleanEmail}`;
    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors: ["Cet email est déjà inscrit. Nous vous avons déjà enregistré !"],
        },
        { status: 409 }
      );
    }

    // Check capacity
    const countResult = await sql`SELECT COUNT(*)::int AS total FROM registrations`;
    const total = countResult[0].total;

    if (total >= MAX_CAPACITY) {
      return NextResponse.json(
        {
          success: false,
          errors: ["Désolé, toutes les places sont prises. Contactez-nous pour être sur liste d'attente."],
        },
        { status: 403 }
      );
    }

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanCompany = (company || "").trim();
    const cleanSchool = (school || "").trim();
    const cleanRole = (role || "").trim();
    const cleanMessage = (message || "").trim();

    await sql`
      INSERT INTO registrations (type, first_name, last_name, email, company, school, role, message)
      VALUES (${profileType}, ${cleanFirstName}, ${cleanLastName}, ${cleanEmail}, ${cleanCompany}, ${cleanSchool}, ${cleanRole}, ${cleanMessage})
    `;

    const newCount = total + 1;

    return NextResponse.json({
      success: true,
      message: `Merci ${cleanFirstName} ! Votre inscription est confirmée.`,
      spotsLeft: MAX_CAPACITY - newCount,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { success: false, errors: ["Une erreur est survenue. Veuillez réessayer."] },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const sql = getDb();
    await initDb();

    const countResult = await sql`SELECT COUNT(*)::int AS total FROM registrations`;
    const total = countResult[0].total;

    // If admin token is provided, return full data
    const authHeader = req.headers.get("authorization");
    const adminToken = process.env.ADMIN_TOKEN || "digizelle-admin-2026";

    if (authHeader === `Bearer ${adminToken}`) {
      const rows = await sql`
        SELECT id, type, first_name, last_name, email, company, school, role, message, registered_at
        FROM registrations
        ORDER BY registered_at DESC
      `;

      const registrations = rows.map((r) => ({
        id: r.id,
        type: r.type || "entreprise",
        firstName: r.first_name,
        lastName: r.last_name,
        email: r.email,
        company: r.company,
        school: r.school || "",
        role: r.role,
        message: r.message,
        registeredAt: r.registered_at,
      }));

      return NextResponse.json({
        total,
        spotsLeft: MAX_CAPACITY - total,
        registrations,
      });
    }

    // Public: only return counts
    return NextResponse.json({
      total,
      spotsLeft: MAX_CAPACITY - total,
    });
  } catch (err) {
    console.error("GET registrations error:", err);
    return NextResponse.json({ total: 0, spotsLeft: MAX_CAPACITY });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const adminToken = process.env.ADMIN_TOKEN || "digizelle-admin-2026";

    if (authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const sql = getDb();
    const result = await sql`DELETE FROM registrations WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return NextResponse.json({ error: "Inscription non trouvée" }, { status: 404 });
    }

    const countResult = await sql`SELECT COUNT(*)::int AS total FROM registrations`;

    return NextResponse.json({ success: true, total: countResult[0].total });
  } catch (err) {
    console.error("DELETE registration error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
