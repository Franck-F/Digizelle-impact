import { NextRequest, NextResponse } from "next/server";
import { sendBroadcast } from "@/lib/broadcast";

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

        // 3. Trigger Broadcast
        console.log(`[Admin-Broadcast] Déclenchement par admin. Test: ${testEmail || "OFF"}`);

        // We don't "await" the whole process if it's a huge list, 
        // but given the scale (likely < 1000), we can await or run in background.
        // For now, let's await to give a clear response to the admin.
        const result = await sendBroadcast(testEmail);

        return NextResponse.json({
            success: true,
            message: testEmail
                ? `Test envoyé avec succès à ${testEmail}`
                : `Diffusion terminée pour ${result.total} contacts.`,
            result
        });

    } catch (err: any) {
        console.error("[Admin-Broadcast] Erreur critique :", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
