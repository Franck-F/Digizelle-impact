import { NextRequest, NextResponse } from "next/server";
import { sendApologyBroadcast } from "@/lib/broadcast";

export async function POST(req: NextRequest) {
    try {
        // 1. Security Check
        const authHeader = req.headers.get("authorization");
        const adminToken = process.env.ADMIN_TOKEN;

        if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
            return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
        }

        // 2. Parse Body (Optional testEmail)
        let testEmail: string | undefined;
        try {
            const body = await req.json();
            testEmail = body.testEmail;
        } catch (e) {
            // Body might be empty, that's fine
        }

        // 3. Trigger Apology Broadcast
        console.log(`[Admin-Apology] Déclenchement par admin. Test: ${testEmail || "OFF"}`);

        const result = await sendApologyBroadcast(testEmail);

        return NextResponse.json({
            success: true,
            message: testEmail
                ? `Email d'excuses envoyé avec succès à ${testEmail}`
                : `Diffusion d'excuses terminée pour ${result.total} contacts.`,
            result
        });

    } catch (err: any) {
        console.error("[Admin-Apology] Erreur critique :", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
