import { getDb } from "./db";
import { buildBroadcastEmailHtml, buildLiteBroadcastEmailHtml, buildApologyEmailHtml, buildLiteApologyEmailHtml, sendEmailGeneric, sendViaSmtpOnly } from "./email";

interface BroadcastResult {
    total: number;
    success: number;
    failed: number;
    errors: { email: string; error: string }[];
}

// Hardcoded list of emails that successfully received apology on first attempt
const SUCCESSFULLY_SENT_EMAILS = [
    "monal.ramchurn@epitech.eu",
    "floreanne.nelson@epitech.digital",
    "joel.diharce@epitech.digital",
    "rajeeva.ravichandiran@epitech.digital",
    "corto.colloc@epitech.digital",
    "franck-dilane1.fambou@epitech.digital",
    "bleuenn.cloteaux@epitech.digital",
];

/**
 * Sends a broadcast email to all registrants.
 * @param testEmail If provided, sends only to this email for testing.
 */
export async function sendBroadcast(testEmail?: string): Promise<BroadcastResult> {
    const sql = getDb();

    // 1. Fetch recipients
    let recipients;
    if (testEmail) {
        console.log(`[Broadcast] Mode TEST : envoi uniquement à ${testEmail}`);
        recipients = await sql`SELECT first_name, last_name, email FROM registrations WHERE email = ${testEmail}`;
    } else {
        console.log(`[Broadcast] Mode PRODUCTION : envoi à TOUS les inscrits`);
        recipients = await sql`SELECT first_name, last_name, email FROM registrations`;
    }

    const result: BroadcastResult = {
        total: recipients.length,
        success: 0,
        failed: 0,
        errors: []
    };

    if (recipients.length === 0) {
        console.warn("[Broadcast] Aucun destinataire trouvé.");
        return result;
    }

    console.log(`[Broadcast] Démarrage de l'envoi pour ${recipients.length} personnes...`);

    // 2. Iterate and send
    for (const user of recipients) {
        try {
            const isEpitech = user.email.toLowerCase().endsWith('@epitech.digital');
            const html = isEpitech
                ? buildLiteBroadcastEmailHtml({ firstName: user.first_name })
                : buildBroadcastEmailHtml({ firstName: user.first_name });

            const text = `Bonjour ${user.first_name}, J-7 avant le Digizelle Impact Event 2026 ! Nous vous attendons Vendredi 13 Mars à 18h00 à l'Epitech Paris. Partagez l'événement : https://impact.digizelle.fr/inscription`;

            const sendResult = await sendEmailGeneric({
                to: user.email,
                subject: "⏳ J-7 : Dernières places disponibles !",
                html,
                text
            });

            if (sendResult.success) {
                result.success++;
                console.log(`[Broadcast] SUCCESS: ${user.email} (${sendResult.provider})`);
            } else {
                result.failed++;
                result.errors.push({ email: user.email, error: sendResult.error || "Unknown error" });
                console.error(`[Broadcast] FAILED: ${user.email} - ${sendResult.error}`);
            }

            // Delay to respect rate limits (1000ms for Resend free tier)
            if (!testEmail) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

        } catch (err: any) {
            result.failed++;
            result.errors.push({ email: user.email, error: err.message || String(err) });
            console.error(`[Broadcast] CRITICAL ERROR for ${user.email}:`, err);
        }
    }

    console.log(`[Broadcast] Terminé. Succès: ${result.success}, Échecs: ${result.failed}`);
    return result;
}

/**
 * Sends an apology broadcast email to all registrants (for OVH server outage).
 * @param testEmail If provided, sends only to this email for testing.
 */
export async function sendApologyBroadcast(testEmail?: string): Promise<BroadcastResult> {
    const sql = getDb();

    // 1. Fetch recipients
    let recipients;
    if (testEmail) {
        console.log(`[Apology-Broadcast] Mode TEST : envoi uniquement à ${testEmail}`);
        recipients = await sql`SELECT first_name, last_name, email FROM registrations WHERE email = ${testEmail}`;
    } else {
        console.log(`[Apology-Broadcast] Mode PRODUCTION : envoi à TOUS les inscrits`);
        recipients = await sql`SELECT first_name, last_name, email FROM registrations`;
    }

    const result: BroadcastResult = {
        total: recipients.length,
        success: 0,
        failed: 0,
        errors: []
    };

    if (recipients.length === 0) {
        console.warn("[Apology-Broadcast] Aucun destinataire trouvé.");
        return result;
    }

    console.log(`[Apology-Broadcast] Démarrage de l'envoi pour ${recipients.length} personnes...`);

    // 2. Iterate and send
    for (const user of recipients) {
        try {
            const isEpitech = user.email.toLowerCase().endsWith('@epitech.digital');
            const html = isEpitech
                ? buildLiteApologyEmailHtml({ firstName: user.first_name })
                : buildApologyEmailHtml({ firstName: user.first_name });

            const text = `Bonjour ${user.first_name}, nous nous excusons sincèrement. Ce matin, suite à un dysfonctionnement de nos serveurs OVH, vous avez reçu plusieurs copies du même email. Le problème a été identifié et résolu. Votre inscription reste valide. Contactez-nous : contact@digizelle.fr`;

            const sendResult = await sendEmailGeneric({
                to: user.email,
                subject: "🙏 Nos excuses — Bug de diffusion résolu",
                html,
                text
            });

            if (sendResult.success) {
                result.success++;
                console.log(`[Apology-Broadcast] SUCCESS: ${user.email} (${sendResult.provider})`);
            } else {
                result.failed++;
                result.errors.push({ email: user.email, error: sendResult.error || "Unknown error" });
                console.error(`[Apology-Broadcast] FAILED: ${user.email} - ${sendResult.error}`);
            }

            // Delay to respect rate limits (1000ms for Resend free tier)
            if (!testEmail) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

        } catch (err: any) {
            result.failed++;
            result.errors.push({ email: user.email, error: err.message || String(err) });
            console.error(`[Apology-Broadcast] CRITICAL ERROR for ${user.email}:`, err);
        }
    }

    console.log(`[Apology-Broadcast] Terminé. Succès: ${result.success}, Échecs: ${result.failed}`);
    return result;
}

/**
 * Retry apology emails ONLY via SMTP for addresses that failed previously
 * STRICT: Rejects any email that was already successfully sent
 */
export async function sendApologyBroadcastRetryFailed(emailsToRetry: string[]): Promise<BroadcastResult> {
    const result: BroadcastResult = {
        total: emailsToRetry.length,
        success: 0,
        failed: 0,
        errors: []
    };

    console.log(`\n[Retry-Apology] 🔴 MODE STRICT: Envoi OVH SMTP UNIQUEMENT`);
    console.log(`[Retry-Apology] 📧 ${emailsToRetry.length} adresses à traiter`);

    // 1. SAFETY CHECK: Verify no email was already successfully sent
    const rejectedEmails: string[] = [];
    const validEmails: string[] = [];

    for (const email of emailsToRetry) {
        const lowerEmail = email.toLowerCase().trim();
        const wasSuccessful = SUCCESSFULLY_SENT_EMAILS.some(e => e.toLowerCase() === lowerEmail);
        
        if (wasSuccessful) {
            rejectedEmails.push(email);
            console.error(`[Retry-Apology] ⛔ REJET: ${email} (déjà reçu avec succès le 1er envoi)`);
        } else {
            validEmails.push(lowerEmail);
        }
    }

    if (rejectedEmails.length > 0) {
        console.warn(`[Retry-Apology] ⚠️  ${rejectedEmails.length} email(s) REJETÉ(S) car déjà reçus:`);
        rejectedEmails.forEach(e => console.warn(`    ❌ ${e}`));
        
        result.errors.push({
            email: `[REJECTED] ${rejectedEmails.length} emails already received`,
            error: `Rejected emails: ${rejectedEmails.join(", ")}`
        });
    }

    if (validEmails.length === 0) {
        console.error(`[Retry-Apology] ❌ AUCUN EMAIL VALIDE À ENVOYER!`);
        result.total = 0;
        return result;
    }

    console.log(`[Retry-Apology] ✅ ${validEmails.length} email(s) valide(s) à envoyer\n`);

    // 2. Fetch user data for valid emails
    const sql = getDb();
    const recipients = await sql`
        SELECT first_name, last_name, email 
        FROM registrations 
        WHERE LOWER(email) = ANY(${validEmails})
    `;

    if (recipients.length === 0) {
        console.warn("[Retry-Apology] Aucun destinataire trouvé en base de données.");
        return result;
    }

    console.log(`[Retry-Apology] 🗄️  ${recipients.length} destinaire(s) trouvés en BDD`);
    console.log(`[Retry-Apology] 🚀 Démarrage envoi OVH SMTP STRICT...\n`);

    // 3. Send ONLY via SMTP (no Resend fallback)
    for (const user of recipients) {
        try {
            const html = buildApologyEmailHtml({ firstName: user.first_name });
            const text = `Bonjour ${user.first_name}, nous nous excusons sincèrement. Ce matin, suite à un dysfonctionnement de nos serveurs OVH, vous avez reçu plusieurs copies du même email. Le problème a été identifié et résolu. Votre inscription reste valide. Contactez-nous : contact@digizelle.fr`;

            console.log(`[Retry-Apology] 📤 Envoi à ${user.email}...`);

            const sendResult = await sendViaSmtpOnly({
                to: user.email,
                subject: "🙏 Nos excuses — Bug de diffusion résolu",
                html,
                text
            });

            if (sendResult.success) {
                result.success++;
                console.log(`[Retry-Apology] ✅ SUCCESS: ${user.email}\n`);
            } else {
                result.failed++;
                result.errors.push({ 
                    email: user.email, 
                    error: sendResult.error || "SMTP failure" 
                });
                console.error(`[Retry-Apology] ❌ FAILED: ${user.email} - ${sendResult.error}\n`);
            }

            // Delay to avoid server overload
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (err: any) {
            result.failed++;
            result.errors.push({ 
                email: user.email, 
                error: err.message || String(err) 
            });
            console.error(`[Retry-Apology] 💥 CRITICAL ERROR: ${user.email}: ${err.message}\n`);
        }
    }

    console.log(`\n[Retry-Apology] ✅ Terminé.`);
    console.log(`[Retry-Apology] 📊 Résultat: ${result.success} succès, ${result.failed} échecs (rejets: ${rejectedEmails.length})`);
    return result;
}
