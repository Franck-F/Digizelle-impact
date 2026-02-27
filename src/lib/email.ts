import nodemailer from "nodemailer";
import { EVENT } from "./constants";

function getTransporter() {
  const smtpKey = process.env.SMTP_KEY;
  if (!smtpKey) {
    throw new Error("SMTP_KEY is not set");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "ssl0.ovh.net",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true,
    auth: {
      user: process.env.SMTP_USER || "contact@digizelle.fr",
      pass: smtpKey,
    },
  });
}

interface ConfirmationEmailData {
  to: string;
  firstName: string;
  lastName: string;
  type: "etudiant" | "entreprise";
  company: string;
  school: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildConfirmationEmailHtml(data: ConfirmationEmailData): string {
  const { firstName, lastName, type, company, school } = data;
  const safeName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeCompany = escapeHtml(company);
  const safeSchool = escapeHtml(school);

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
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7301FF 0%, #5B21B6 100%); border-radius: 16px 16px 0 0; padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0 0 4px; font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: 3px;">
                DIGIZELLE
              </h1>
              <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.8); letter-spacing: 1.5px; text-transform: uppercase;">
                Impact Event 2026
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 40px 32px;">

              <!-- Confirmation badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <div style="display: inline-block; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 50px; padding: 8px 24px;">
                      <span style="font-size: 14px; color: #16A34A; font-weight: 600;">&#10003; Inscription confirmée</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <h2 style="margin: 0 0 16px; font-size: 22px; color: #24325F; font-weight: 700;">
                Bonjour ${safeName} ${safeLastName},
              </h2>
              <p style="margin: 0 0 8px; font-size: 15px; color: #4B5563; line-height: 1.6;">
                Nous avons le plaisir de confirmer votre inscription au <strong style="color: #24325F;">${escapeHtml(EVENT.name)}</strong>.
              </p>
              ${profileLine ? `<p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6;">${profileLine}</p>` : '<div style="height: 24px;"></div>'}

              <!-- Event details card -->
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
                                <span style="font-size: 13px; color: #6B7280;">Accueil à partir de 18h30</span>
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

              <!-- Programme preview -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-size: 12px; color: #7301FF; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Programme</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding: 12px 16px; border-left: 3px solid #7301FF; background-color: #FAFAFA; border-radius: 0 8px 8px 0; margin-bottom: 8px;">
                          <span style="font-size: 13px; color: #7301FF; font-weight: 700;">18h30</span>
                          <span style="font-size: 14px; color: #24325F; font-weight: 600;"> — Ouverture & Accueil</span>
                        </td>
                      </tr>
                      <tr><td style="height: 8px;"></td></tr>
                      <tr>
                        <td style="padding: 12px 16px; border-left: 3px solid #7301FF; background-color: #FAFAFA; border-radius: 0 8px 8px 0;">
                          <span style="font-size: 13px; color: #7301FF; font-weight: 700;">18h40</span>
                          <span style="font-size: 14px; color: #24325F; font-weight: 600;"> — Keynote & Table Ronde</span>
                        </td>
                      </tr>
                      <tr><td style="height: 8px;"></td></tr>
                      <tr>
                        <td style="padding: 12px 16px; border-left: 3px solid #7301FF; background-color: #FAFAFA; border-radius: 0 8px 8px 0;">
                          <span style="font-size: 13px; color: #7301FF; font-weight: 700;">20h00</span>
                          <span style="font-size: 14px; color: #24325F; font-weight: 600;"> — Networking & Cocktail</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 4px 0 24px;">
                    <a href="${EVENT.mapsUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #7301FF 0%, #5B21B6 100%); color: #FFFFFF; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Voir l'itinéraire &#8594;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 0 0 24px;" />

              <p style="margin: 0; font-size: 14px; color: #6B7280; line-height: 1.6; text-align: center;">
                Une question ? Contactez-nous à<br />
                <a href="mailto:contact@digizelle.fr" style="color: #7301FF; text-decoration: none; font-weight: 600;">contact@digizelle.fr</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #24325F; border-radius: 0 0 16px 16px; padding: 28px 32px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 2px; text-transform: uppercase;">
                ${escapeHtml(EVENT.motto)}
              </p>
              <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.4);">
                &copy; 2026 Digizelle. Tous droits réservés.
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

export async function sendConfirmationEmail(data: ConfirmationEmailData) {
  const html = buildConfirmationEmailHtml(data);
  const transporter = getTransporter();

  await new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        console.error("Erreur de connexion SMTP :", error);
        reject(error);
      } else {
        console.log("Serveur SMTP prêt à envoyer des messages");
        resolve(success);
      }
    });
  });

  await new Promise((resolve, reject) => {
    transporter.sendMail({
      from: `"Digizelle" <${process.env.SMTP_FROM || "contact@digizelle.fr"}>`,
      to: data.to,
      subject: `Inscription confirmée — ${EVENT.name}`,
      html,
    }, (err, info) => {
      if (err) {
        console.error("Erreur serveur SMTP (Envoi):", err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}
