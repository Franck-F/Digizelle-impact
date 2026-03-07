const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");
const nodemailer = require("nodemailer");

// Load environment variables
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    if (line.trim().startsWith("#") || line.trim() === "") return;
    const equalIndex = line.indexOf("=");
    if (equalIndex > 0) {
      const key = line.substring(0, equalIndex).trim();
      let value = line.substring(equalIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const sql = neon(process.env.DATABASE_URL);

// Event constants
const EVENT = {
  name: "Digizelle Impact Event 2026",
  displayDate: "Samedi 5 avril 2026",
  location: "125 Rue de la Santé",
  address: "75013 Paris",
  tagline: "Digitalisation & Environnement",
};

// Email addresses to retry
const TARGET_EMAILS = [
  "alex-40390@hotmail.fr",
  "anais.albath@databricks.com"
];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildConfirmationEmailHtml(data) {
  const { firstName, lastName, type, company, school } = data;
  const safeName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeCompany = escapeHtml(company || "");
  const safeSchool = escapeHtml(school || "");

  const profileLine =
    type === "etudiant" && safeSchool
      ? `<span style="color: #6B7280;">Étudiant(e) — ${safeSchool}</span>`
      : safeCompany
        ? `<span style="color: #6B7280;">${safeCompany}</span>`
        : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation d'inscription — ${escapeHtml(EVENT.name)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F0FF; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F3F0FF;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; border-radius: 16px; overflow: hidden; background-color: #FFFFFF; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #FFFFFF; padding: 48px 32px 32px; text-align: center; border-bottom: 1px solid #F3F0FF;">
              <h1 style="margin: 0 0 6px; font-size: 26px; font-weight: 800; color: #24325F; letter-spacing: 3px;">
                DIGIZELLE
              </h1>
              <p style="margin: 0; font-size: 13px; color: #6B7280; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">
                Impact Event 2026
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #FFFFFF; padding: 40px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <div style="display: inline-block; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 50px; padding: 8px 24px;">
                      <span style="font-size: 14px; color: #16A34A; font-weight: 600;">&#10003; Inscription confirmée</span>
                    </div>
                  </td>
                </tr>
              </table>
              <h2 style="margin: 0 0 16px; font-size: 22px; color: #24325F; font-weight: 700;">
                Bonjour ${safeName} ${safeLastName},
              </h2>
              <p style="margin: 0 0 8px; font-size: 15px; color: #4B5563; line-height: 1.6;">
                Nous avons le plaisir de confirmer votre inscription au <strong style="color: #24325F;">${escapeHtml(EVENT.name)}</strong>.
              </p>
              ${profileLine ? `<p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6;">${profileLine}</p>` : '<div style="height: 24px;"></div>'}
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F7FF; border: 1px solid #E9E5FF; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <span style="font-size: 12px; color: #7301FF; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Détails de l'événement</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 28px; vertical-align: top; font-size: 16px;">&#128197;</td>
                              <td>
                                <span style="font-size: 15px; color: #24325F; font-weight: 600;">${escapeHtml(EVENT.displayDate)}</span>
                                <br />
                                <span style="font-size: 13px; color: #6B7280;">Accueil à partir de 18h00</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 28px; vertical-align: top; font-size: 16px;">&#128205;</td>
                              <td>
                                <span style="font-size: 15px; color: #24325F; font-weight: 600;">${escapeHtml(EVENT.location)}</span>
                                <br />
                                <span style="font-size: 13px; color: #6B7280;">${escapeHtml(EVENT.address)}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 28px; vertical-align: top; font-size: 16px;">&#127775;</td>
                              <td>
                                <span style="font-size: 15px; color: #24325F; font-weight: 600;">Thème</span>
                                <br />
                                <span style="font-size: 13px; color: #6B7280;">${escapeHtml(EVENT.tagline)}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 20px; font-size: 15px; color: #4B5563; line-height: 1.6;">
                Nous avons hâte de vous retrouver pour une soirée dédiée à l'innovation et à l'impact positif de la tech.
              </p>
              <p style="margin: 0 0 4px; font-size: 14px; color: #6B7280;">
                À très bientôt,
              </p>
              <p style="margin: 0; font-size: 14px; color: #24325F; font-weight: 600;">
                L'équipe Digizelle
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8F7FF; padding: 24px 32px; text-align: center; border-top: 1px solid #E9E5FF;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF;">
                © 2026 Digizelle. Tous droits réservés.
              </p>
              <p style="margin: 0; font-size: 11px; color: #9CA3AF;">
                Pour toute question : <a href="mailto:contact@digizelle.fr" style="color: #7301FF; text-decoration: none;">contact@digizelle.fr</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendConfirmationViaSmtp(user) {
  const smtpKey = process.env.SMTP_KEY;
  const smtpUser = process.env.SMTP_USER || "contact@digizelle.fr";
  const smtpHost = process.env.SMTP_HOST || "ssl0.ovh.net";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  if (!smtpKey) {
    throw new Error("SMTP_KEY manquante");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpKey,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  const html = buildConfirmationEmailHtml({
    firstName: user.first_name,
    lastName: user.last_name,
    type: user.type,
    company: user.company,
    school: user.school,
  });

  const text = `Bonjour ${user.first_name} ${user.last_name}, votre inscription au ${EVENT.name} est confirmée. Rendez-vous le ${EVENT.displayDate} à ${EVENT.location}.`;

  await transporter.sendMail({
    from: `"Digizelle" <${process.env.SMTP_FROM || smtpUser}>`,
    to: user.email,
    replyTo: "contact@digizelle.fr",
    subject: `Confirmation d'inscription — ${EVENT.name}`,
    html,
    text,
  });
}

async function retryConfirmationEmails() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 RENVOI DES EMAILS DE CONFIRMATION D'INSCRIPTION");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("⚠️  EMAILS CIBLÉS :");
  TARGET_EMAILS.forEach((email, i) => {
    console.log(`   ${i + 1}. ${email}`);
  });
  console.log("");

  const results = {
    success: [],
    failed: [],
    notFound: [],
  };

  for (const email of TARGET_EMAILS) {
    console.log(`\n📧 Traitement de: ${email}`);
    
    try {
      // Récupérer les données de l'utilisateur
      const users = await sql`
        SELECT id, email, first_name, last_name, type, company, school
        FROM registrations
        WHERE email = ${email}
      `;

      if (users.length === 0) {
        console.log("   ❌ Non trouvé dans la base");
        results.notFound.push(email);
        continue;
      }

      const user = users[0];
      console.log(`   ✅ Trouvé: ${user.first_name} ${user.last_name}`);
      console.log(`   📤 Envoi via OVH SMTP...`);

      // Envoyer l'email
      await sendConfirmationViaSmtp(user);
      
      // Mettre à jour le statut
      await sql`
        UPDATE registrations
        SET email_status = 'sent',
            email_provider = 'ovh-retry',
            email_error = ''
        WHERE email = ${email}
      `;

      console.log(`   ✅ Email envoyé avec succès`);
      results.success.push(email);

    } catch (error) {
      console.error(`   ❌ ERREUR: ${error.message}`);
      results.failed.push({ email, error: error.message });
      
      // Mettre à jour avec l'erreur
      try {
        await sql`
          UPDATE registrations
          SET email_status = 'failed',
              email_provider = 'ovh-retry-failed',
              email_error = ${error.message}
          WHERE email = ${email}
        `;
      } catch (dbError) {
        console.error(`   ⚠️  Impossible de mettre à jour la base: ${dbError.message}`);
      }
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 RÉSUMÉ");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  console.log(`✅ Succès: ${results.success.length}`);
  if (results.success.length > 0) {
    results.success.forEach(email => console.log(`   - ${email}`));
  }
  
  console.log(`\n❌ Échecs: ${results.failed.length}`);
  if (results.failed.length > 0) {
    results.failed.forEach(({ email, error }) => {
      console.log(`   - ${email}`);
      console.log(`     Erreur: ${error}`);
    });
  }
  
  console.log(`\n⚠️  Non trouvés: ${results.notFound.length}`);
  if (results.notFound.length > 0) {
    results.notFound.forEach(email => console.log(`   - ${email}`));
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

retryConfirmationEmails()
  .then(() => {
    console.log("✅ Script terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ ERREUR FATALE:", error);
    process.exit(1);
  });
