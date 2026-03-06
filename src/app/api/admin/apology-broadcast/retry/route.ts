import { NextRequest, NextResponse } from "next/server";
import { sendApologyBroadcastRetryFailed } from "@/lib/broadcast";

export async function POST(req: NextRequest) {
    try {
        // 1. Security Check
        const authHeader = req.headers.get("authorization");
        const adminToken = process.env.ADMIN_TOKEN;

        if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
            return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
        }

        // 2. Parse body to get email list
        let emailsToRetry: string[] = [];
        try {
            const body = await req.json();
            if (!Array.isArray(body.emails)) {
                return NextResponse.json(
                    { success: false, error: "emails doit être un array" },
                    { status: 400 }
                );
            }
            emailsToRetry = body.emails.map((e: string) => e.trim().toLowerCase());
        } catch (e) {
            return NextResponse.json(
                { success: false, error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        if (emailsToRetry.length === 0) {
            return NextResponse.json(
                { success: false, error: "emails array est vide" },
                { status: 400 }
            );
        }

        // 3. Trigger Retry Broadcast
        console.log(`[Admin-Retry-Apology] Déclenchement par admin. Emails: ${emailsToRetry.length}`);

        const result = await sendApologyBroadcastRetryFailed(emailsToRetry);

        return NextResponse.json({
            success: true,
            message: `Envoi OVH SMTP pour ${result.total} adresses. Succès: ${result.success}, Échoué: ${result.failed}`,
            result
        });

    } catch (err: any) {
        console.error("[Admin-Retry-Apology] Erreur critique :", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
