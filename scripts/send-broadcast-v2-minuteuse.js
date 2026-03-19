const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");
const nodemailer = require("nodemailer");

const TEST_WHITELIST = [
  "franckfambou@gmail.com",
  "franck-dilane1.fambou@epitech.digital",
];

const CAMPAIGN_ID = "broadcast-v2-2026-03-13";
const REQUIRED_PROD_CONFIRMATION = "SEND_V2_BROADCAST";
const INFOS_PRATIQUES_URL = "https://impact.digizelle.fr/infos-pratiques";
const EMAIL_SUBJECT = "C’est aujourd’hui : toutes les infos pour votre arrivée ce soir";
const EMAIL_PREHEADER = "Horaires, accès, entrée principale et temps forts de la soirée.";
const DELIVERY_PATH = "SMTP_OVH_ONLY";

function loadEnvFile() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;

  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    if (line.trim().startsWith("#") || line.trim() === "") return;
    const equalIndex = line.indexOf("=");
    if (equalIndex <= 0) return;

    const key = line.substring(0, equalIndex).trim();
    let value = line.substring(equalIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {
    mode: "test",
    dryRun: false,
    delayMs: 60000,
    confirm: "",
    ignoreLog: false,
    max: null,
    emails: [],
  };

  for (const arg of args) {
    if (arg === "--test") flags.mode = "test";
    else if (arg === "--prod") flags.mode = "prod";
    else if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--ignore-log") flags.ignoreLog = true;
    else if (arg.startsWith("--confirm=")) flags.confirm = arg.split("=")[1] || "";
    else if (arg.startsWith("--delay-ms=")) flags.delayMs = Number(arg.split("=")[1]);
    else if (arg.startsWith("--max=")) flags.max = Number(arg.split("=")[1]);
    else if (arg.startsWith("--emails=")) {
      flags.emails = arg
        .slice("--emails=".length)
        .split(",")
        .map((email) => String(email || "").trim().toLowerCase())
        .filter(Boolean);
    }
  }

  if (!Number.isFinite(flags.delayMs) || flags.delayMs < 0) {
    throw new Error("--delay-ms doit être un nombre >= 0");
  }

  if (flags.max !== null && (!Number.isFinite(flags.max) || flags.max <= 0)) {
    throw new Error("--max doit être un nombre > 0");
  }

  return flags;
}

function sanitize(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFirstNameFromEmail(email) {
  const local = String(email || "").split("@")[0] || "";
  const base = local.split(/[._-]/)[0] || "";
  if (!base) return "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function buildHtml(firstName) {
  const safeFirstName = sanitize(firstName || "");
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${sanitize(EMAIL_SUBJECT)}</title>
</head>
<body style="margin:0; padding:0; background:#F3F0FF; font-family:Arial, Helvetica, sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${sanitize(EMAIL_PREHEADER)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F3F0FF; padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:600px; background:#FFFFFF; border:1px solid #E9E5FF;">
          <tr>
            <td style="padding:28px 24px 10px;">
              <p style="margin:0; font-size:24px; line-height:30px; font-weight:bold; color:#24325F;">DIGIZELLE</p>
              <p style="margin:6px 0 0; font-size:12px; line-height:18px; color:#7301FF; font-weight:bold; text-transform:uppercase;">Impact Event 2026</p>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 24px 24px; color:#3F3F46; font-size:15px; line-height:24px;">
              <p style="margin:0 0 12px;">Bonjour ${safeFirstName || ""},</p>
              <p style="margin:0 0 14px;">Le Digizelle Impact Event 2026, c’est ce soir 🎉</p>
              <p style="margin:0 0 10px;">Pour une arrivée sereine, voici les infos essentielles :</p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8F7FF; border:1px solid #E9E5FF; margin:0 0 16px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 8px; font-size:14px; line-height:22px; font-weight:bold; color:#24325F;">Rappel rapide</p>
                    <p style="margin:0 0 6px;"><strong>Date &amp; heure :</strong> aujourd’hui, vendredi 13 mars — accueil à partir de 17h40</p>
                    <p style="margin:0 0 6px;"><strong>Lieu :</strong> Epitech Paris, 24 Rue Pasteur, 94270 Le Kremlin-Bicêtre</p>
                    <p style="margin:0 0 6px;"><strong>Entrée :</strong> entrée principale (côté Rue Pasteur)</p>
                    <p style="margin:0;"><strong>Plan &amp; itinéraire :</strong> <a href="${INFOS_PRATIQUES_URL}" target="_blank" style="color:#7301FF; font-weight:bold; text-decoration:none;">Infos pratiques</a></p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;">🕒 <strong>Conseil :</strong> arrivez 15 à 20 minutes avant le début pour fluidifier l’accueil.</p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FFFFFF; border:1px solid #E9E5FF; margin:0 0 16px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 8px; font-size:14px; line-height:22px; font-weight:bold; color:#24325F;">Temps forts de la soirée</p>
                    <p style="margin:0 0 6px;">18h15–19h00 : Table ronde — Demain se code aujourd’hui</p>
                    <p style="margin:0 0 6px;">19h05–19h50 : Table ronde — L’ambition sans limites</p>
                    <p style="margin:0;">20h00 : Networking stratégique</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;">En cas d’imprévu, vous pouvez simplement répondre à cet email.</p>
              <p style="margin:0 0 16px;">À tout à l’heure,</p>
              <p style="margin:0; font-weight:bold; color:#24325F;">L’équipe Digizelle</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(firstName) {
  return [
    `Bonjour ${firstName || ""},`,
    "",
    "Le Digizelle Impact Event 2026, c’est ce soir.",
    "Pour une arrivée sereine, voici les infos essentielles :",
    "",
    "RAPPEL RAPIDE",
    "Date & heure : aujourd’hui, vendredi 13 mars — accueil à partir de 17h40",
    "Lieu : Epitech Paris, 24 Rue Pasteur, 94270 Le Kremlin-Bicêtre",
    "Entrée : entrée principale (côté Rue Pasteur)",
    `Plan & itinéraire : ${INFOS_PRATIQUES_URL}`,
    "",
    "Conseil : arrivez 15 à 20 minutes avant le début pour fluidifier l’accueil.",
    "",
    "TEMPS FORTS DE LA SOIRÉE",
    "18h15–19h00 : Table ronde — Demain se code aujourd’hui",
    "19h05–19h50 : Table ronde — L’ambition sans limites",
    "20h00 : Networking stratégique",
    "",
    "En cas d’imprévu, vous pouvez simplement répondre à cet email.",
    "À tout à l’heure,",
    "",
    "L’équipe Digizelle",
  ].join("\n");
}

function getLogPath() {
  return path.join(__dirname, "state", `${CAMPAIGN_ID}.json`);
}

function getLockPath() {
  return path.join(__dirname, "state", `${CAMPAIGN_ID}.lock`);
}

function ensureStateDir() {
  const dir = path.join(__dirname, "state");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadSentLog() {
  ensureStateDir();
  const logPath = getLogPath();
  if (!fs.existsSync(logPath)) {
    return { campaignId: CAMPAIGN_ID, sent: [], sending: [] };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(logPath, "utf8"));
    return {
      campaignId: parsed.campaignId || CAMPAIGN_ID,
      sent: Array.isArray(parsed.sent) ? parsed.sent.map((e) => String(e).toLowerCase()) : [],
      sending: Array.isArray(parsed.sending) ? parsed.sending.map((e) => String(e).toLowerCase()) : [],
    };
  } catch {
    return { campaignId: CAMPAIGN_ID, sent: [], sending: [] };
  }
}

function saveSentLog(log) {
  ensureStateDir();
  const payload = {
    campaignId: CAMPAIGN_ID,
    updatedAt: new Date().toISOString(),
    sent: Array.from(new Set(log.sent.map((e) => String(e).toLowerCase()))),
    sending: Array.from(new Set((log.sending || []).map((e) => String(e).toLowerCase()))),
  };
  fs.writeFileSync(getLogPath(), JSON.stringify(payload, null, 2), "utf8");
}

function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function acquireRunLock() {
  ensureStateDir();
  const lockPath = getLockPath();

  if (fs.existsSync(lockPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(lockPath, "utf8"));
      const existingPid = Number(raw.pid);
      if (isPidAlive(existingPid)) {
        throw new Error(`Une diffusion est déjà en cours (pid=${existingPid}). Arrêt de sécurité.`);
      }
      fs.unlinkSync(lockPath);
    } catch (error) {
      if (error && error.message && error.message.includes("déjà en cours")) {
        throw error;
      }
      if (fs.existsSync(lockPath)) {
        fs.unlinkSync(lockPath);
      }
    }
  }

  const lock = {
    pid: process.pid,
    campaignId: CAMPAIGN_ID,
    startedAt: new Date().toISOString(),
  };
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2), "utf8");

  return () => {
    try {
      if (!fs.existsSync(lockPath)) return;
      const current = JSON.parse(fs.readFileSync(lockPath, "utf8"));
      if (Number(current.pid) === process.pid) {
        fs.unlinkSync(lockPath);
      }
    } catch {
      if (fs.existsSync(lockPath)) {
        fs.unlinkSync(lockPath);
      }
    }
  };
}

async function wait(ms) {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function buildTransporter() {
  const smtpKey = process.env.SMTP_KEY;
  const smtpUser = process.env.SMTP_USER || "contact@digizelle.fr";
  const smtpHost = process.env.SMTP_HOST || "ssl0.ovh.net";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  if (!smtpKey) {
    throw new Error("SMTP_KEY manquante. Envoi impossible.");
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpKey,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

function normalizeRecipients(rows) {
  const byEmail = new Map();
  for (const row of rows) {
    const email = String(row.email || "").trim().toLowerCase();
    if (!email) continue;
    if (!byEmail.has(email)) {
      byEmail.set(email, {
        email,
        firstName: String(row.first_name || "").trim(),
      });
    }
  }
  return Array.from(byEmail.values());
}

async function fetchRecipients({ mode, sql, targetEmails }) {
  if (Array.isArray(targetEmails) && targetEmails.length > 0) {
    const normalizedTargets = Array.from(new Set(targetEmails.map((email) => String(email).toLowerCase())));
    const rows = await sql`
      SELECT email, first_name
      FROM registrations
      WHERE LOWER(email) = ANY(${normalizedTargets})
    `;

    const fromDb = normalizeRecipients(rows);
    const byEmail = new Map(fromDb.map((r) => [r.email, r]));

    for (const email of normalizedTargets) {
      if (!byEmail.has(email)) {
        byEmail.set(email, { email, firstName: getFirstNameFromEmail(email) });
      }
    }

    return Array.from(byEmail.values());
  }

  if (mode === "test") {
    const rows = await sql`
      SELECT email, first_name
      FROM registrations
      WHERE LOWER(email) = ANY(${TEST_WHITELIST.map((e) => e.toLowerCase())})
    `;

    const fromDb = normalizeRecipients(rows);
    const byEmail = new Map(fromDb.map((r) => [r.email, r]));

    for (const email of TEST_WHITELIST) {
      const lower = email.toLowerCase();
      if (!byEmail.has(lower)) {
        byEmail.set(lower, { email: lower, firstName: getFirstNameFromEmail(lower) });
      }
    }

    return Array.from(byEmail.values());
  }

  const rows = await sql`
    SELECT email, first_name
    FROM registrations
    WHERE email IS NOT NULL
  `;
  return normalizeRecipients(rows);
}

async function sendOne({ transporter, recipient }) {
  const smtpUser = process.env.SMTP_USER || "contact@digizelle.fr";
  const from = process.env.SMTP_FROM || smtpUser;
  const firstName = recipient.firstName || getFirstNameFromEmail(recipient.email) || "";

  const html = buildHtml(firstName);
  const text = buildText(firstName);

  await transporter.sendMail({
    from: `"Digizelle" <${from}>`,
    to: recipient.email,
    replyTo: "contact@digizelle.fr",
    subject: EMAIL_SUBJECT,
    html,
    text,
  });
}

async function main() {
  loadEnvFile();
  const flags = parseArgs();
  let releaseLock = null;

  if (!flags.dryRun) {
    releaseLock = acquireRunLock();
  }

  try {
    if (flags.mode === "prod" && flags.confirm !== REQUIRED_PROD_CONFIRMATION) {
      throw new Error(
        `Mode production bloqué. Utilisez --confirm=${REQUIRED_PROD_CONFIRMATION} après validation explicite.`
      );
    }

    if (flags.mode === "prod" && flags.ignoreLog) {
      throw new Error("Mode production interdit avec --ignore-log (protection anti-doublon).");
    }

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL manquante");
    }

    const sql = neon(process.env.DATABASE_URL);
    const sentLog = flags.ignoreLog
      ? { campaignId: CAMPAIGN_ID, sent: [], sending: [] }
      : loadSentLog();
    const alreadySent = new Set(sentLog.sent.map((e) => String(e).toLowerCase()));
    const alreadySending = new Set((sentLog.sending || []).map((e) => String(e).toLowerCase()));

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📣 Diffusion minuteuse V2 (${CAMPAIGN_ID})`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Mode            : ${flags.mode.toUpperCase()}`);
  console.log(`Dry run         : ${flags.dryRun ? "OUI" : "NON"}`);
  console.log(`Délai           : ${flags.delayMs} ms`);
  console.log(`Ignore log      : ${flags.ignoreLog ? "OUI" : "NON"}`);
  console.log(`Chemin d'envoi  : ${DELIVERY_PATH}`);
  console.log(`Préheader       : ${EMAIL_PREHEADER}`);
  console.log(`Objet           : ${EMAIL_SUBJECT}`);
  console.log("");

    const fetched = await fetchRecipients({ mode: flags.mode, sql, targetEmails: flags.emails });

    let recipients = fetched.filter((r) => !alreadySent.has(r.email) && !alreadySending.has(r.email));

    if (flags.mode === "test" && (!flags.emails || flags.emails.length === 0)) {
      const whitelist = new Set(TEST_WHITELIST.map((e) => e.toLowerCase()));
      recipients = recipients.filter((r) => whitelist.has(r.email));
    }

    if (flags.max !== null) {
      recipients = recipients.slice(0, flags.max);
    }

    if (recipients.length === 0) {
      console.log("✅ Aucun destinataire à envoyer (tout a déjà été envoyé ou aucun email éligible).");
      return;
    }

    console.log(`Destinataires retenus : ${recipients.length}`);
    recipients.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.email} (${r.firstName || "prénom inconnu"})`);
    });
    console.log("");

    if (flags.dryRun) {
      console.log("🧪 DRY RUN: aucun email n'a été envoyé.");
      return;
    }

    const transporter = buildTransporter();

    const report = {
      total: recipients.length,
      success: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];

      try {
        sentLog.sending = sentLog.sending || [];
        sentLog.sending.push(recipient.email);
        saveSentLog(sentLog);

        console.log(`📤 [${i + 1}/${recipients.length}] Envoi à ${recipient.email}...`);
        await sendOne({ transporter, recipient });
        report.success += 1;
        sentLog.sent.push(recipient.email);
        sentLog.sending = (sentLog.sending || []).filter((email) => email !== recipient.email);
        saveSentLog(sentLog);
        console.log(`✅ OK: ${recipient.email}`);
      } catch (error) {
        report.failed += 1;
        const message = error && error.message ? error.message : String(error);
        report.errors.push({ email: recipient.email, error: message });
        sentLog.sending = (sentLog.sending || []).filter((email) => email !== recipient.email);
        saveSentLog(sentLog);
        console.error(`❌ KO: ${recipient.email} -> ${message}`);
      }

      if (i < recipients.length - 1) {
        await wait(flags.delayMs);
      }
    }


    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 Résultat");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Total  : ${report.total}`);
    console.log(`Succès : ${report.success}`);
    console.log(`Échecs : ${report.failed}`);

    if (report.errors.length > 0) {
      console.log("\nDétails erreurs :");
      for (const err of report.errors) {
        console.log(`- ${err.email}: ${err.error}`);
      }
    }
  } finally {
    if (typeof releaseLock === "function") {
      releaseLock();
    }
  }
}

main().catch((error) => {
  console.error("\n❌ Erreur fatale:", error.message || error);
  process.exit(1);
});
