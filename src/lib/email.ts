import { Resend } from "resend";
import nodemailer from "nodemailer";
import { EVENT } from "./constants";
import { LOGO_BASE64 } from "./logoBase64";

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
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; border-radius: 16px; overflow: hidden; background-color: #FFFFFF; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 48px 32px 32px; text-align: center; border-bottom: 1px solid #F3F0FF;">
              <img src="cid:digizelleLogo" alt="Digizelle" width="100" style="display: block; margin: 0 auto 20px; width: 100px; height: auto;" />
              <h1 style="margin: 0 0 6px; font-size: 26px; font-weight: 800; color: #24325F; letter-spacing: 3px;">
                DIGIZELLE
              </h1>
              <p style="margin: 0; font-size: 13px; color: #6B7280; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">
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
                          <span style="font-size: 13px; color: #7301FF; font-weight: 700;">18h00</span>
                          <span style="font-size: 14px; color: #24325F; font-weight: 600;"> — Ouverture & Accueil</span>
                        </td>
                      </tr>
                      <tr><td style="height: 8px;"></td></tr>
                      <tr>
                        <td style="padding: 12px 16px; border-left: 3px solid #7301FF; background-color: #FAFAFA; border-radius: 0 8px 8px 0;">
                          <span style="font-size: 13px; color: #7301FF; font-weight: 700;">18h10</span>
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

function buildLiteConfirmationEmailHtml(data: { firstName: string; lastName: string }) {
  return `
    <div style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #6d28d9;">Confirmation d'inscription</h2>
      <p>Bonjour ${data.firstName} ${data.lastName},</p>
      <p>Votre inscription au <strong>${EVENT.name}</strong> a bien été enregistrée.</p>
      <p><strong>Date :</strong> ${EVENT.displayDate} à 18h00<br>
      <strong>Lieu :</strong> ${EVENT.location}</p>
      <p>Nous avons hâte de vous y retrouver !</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">Cet email est une confirmation automatique envoyée par Digizelle.</p>
    </div>
  `;
}

export function buildBroadcastEmailHtml(data: { firstName: string }): string {
  const safeName = escapeHtml(data.firstName);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7FF; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1F2937;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F7FF;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; border-radius: 12px; overflow: hidden; background-color: #FFFFFF; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px; text-align: center; border-bottom: 1px solid #F3F0FF;">
              <img src="cid:digizelleLogo" alt="Digizelle" width="80" style="display: block; margin: 0 auto 16px; width: 80px;" />
              <p style="margin: 0; font-size: 11px; color: #7301FF; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                Impact Event 2026
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; font-size: 22px; color: #24325F; font-weight: 700;">
                Bonjour ${safeName},
              </h2>
              
              <p style="margin: 0 0 12px; font-size: 16px; line-height: 1.6;">
                J-7 avant le <strong style="color: #7301FF;">${escapeHtml(EVENT.name)}</strong> ! 🚀
              </p>
              
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Nous vous attendons <strong style="color: #24325F;">Vendredi 13 Mars</strong> à <strong style="color: #24325F;">18h00</strong> à l'Epitech Paris pour une soirée exceptionnelle.
              </p>

              <!-- Highlight Box -->
              <div style="background-color: #F5F3FF; border-left: 4px solid #7301FF; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 32px;">
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #24325F;">
                  📢 Partagez l'impact !
                </p>
                <p style="margin: 8px 0 0; font-size: 14px; color: #4B5563; line-height: 1.5;">
                  Il reste encore quelques places disponibles. Connaissez-vous quelqu'un qui devrait nous rejoindre ?
                </p>
              </div>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://impact.digizelle.fr/inscription" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #7301FF 0%, #5B21B6 100%); color: #FFFFFF; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px;">
                      Partager le lien d'inscription &#8594;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAFAFA; padding: 24px 32px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #9CA3AF;">
                À vendredi prochain,<br />
                <strong>L'équipe Digizelle</strong>
              </p>
            </td>
          </tr>

        </table>
        
        <p style="margin: 24px 0 0; font-size: 12px; color: #9CA3AF; text-align: center;">
          Vous recevez ce mail car vous êtes inscrit à l'événement Digizelle Impact 2026.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildLiteBroadcastEmailHtml(data: { firstName: string }): string {
  const safeName = escapeHtml(data.firstName);
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #7301FF;">Bonjour ${safeName},</h2>
      <p>J-7 avant le <strong>Digizelle Impact Event 2026</strong> ! 🚀</p>
      <p>Nous vous attendons <strong>Vendredi 13 Mars</strong> à <strong>18h00</strong> à l'Epitech Paris pour une soirée exceptionnelle.</p>
      <div style="background-color: #F5F3FF; border-left: 4px solid #7301FF; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">📢 Partagez l'impact !</p>
        <p style="margin: 5px 0 0;">Il reste encore quelques places disponibles. N'hésitez pas à partager le lien d'inscription :</p>
        <p style="margin: 10px 0 0;"><a href="https://impact.digizelle.fr/inscription" style="color: #7301FF; font-weight: bold;">https://impact.digizelle.fr/inscription</a></p>
      </div>
      <p>À vendredi prochain,<br><strong>L'équipe Digizelle</strong></p>
    </div>
  `;
}

export async function sendConfirmationEmail(data: ConfirmationEmailData): Promise<{ success: boolean; provider: string; error?: string }> {
  const isEpitech = data.to.toLowerCase().endsWith('@epitech.digital');

  const html = isEpitech ? buildLiteConfirmationEmailHtml(data) : buildConfirmationEmailHtml(data);
  const text = `Bonjour ${data.firstName} ${data.lastName}, votre inscription au ${EVENT.name} est confirmée. Rendez-vous le ${EVENT.displayDate} à ${EVENT.location}.`;

  if (isEpitech) {
    console.log(`[Email-Hybrid] Détection Epitech : Routage via OVH SMTP pour ${data.to}`);

    const smtpKey = process.env.SMTP_KEY;
    const smtpUser = process.env.SMTP_USER || "contact@digizelle.fr";
    const smtpHost = process.env.SMTP_HOST || "ssl0.ovh.net";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    if (!smtpKey) {
      console.error("[Email-Hybrid] ERREUR : SMTP_KEY manquante !");
      console.warn("[Email-Hybrid] Tentative de secours via Resend...");
      return await sendViaResend(data, html, text);
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

    try {
      console.log(`[Email-Hybrid] Tentative SMTP ${smtpHost}:${smtpPort}...`);

      const info = await new Promise((resolve, reject) => {
        transporter.sendMail({
          from: `"Digizelle" <${process.env.SMTP_FROM || smtpUser}>`,
          to: data.to,
          replyTo: "contact@digizelle.fr",
          subject: `Confirmation d'inscription — ${EVENT.name}`,
          html,
          text,
          attachments: isEpitech ? [] : [
            {
              filename: 'logo.png',
              content: Buffer.from(LOGO_BASE64, 'base64'),
              cid: 'digizelleLogo'
            }
          ]
        }, (err, info) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      console.log(`[Email-Hybrid] Succès OVH pour ${data.to}. MessageId:`, (info as any).messageId);
      return { success: true, provider: "ovh" };
    } catch (err: any) {
      console.error("[Email-Hybrid] ÉCHEC OVH/SMTP :", err.message || err);
      console.warn("[Email-Hybrid] Tentative de secours via Resend après échec SMTP...");
      const resendResult = await sendViaResend(data, html, text);
      return {
        ...resendResult,
        error: `OVH Failed: ${err.message || String(err)}. Resend Result: ${resendResult.success ? "Success" : "Failed"}`
      };
    }

  } else {
    return await sendViaResend(data, html, text);
  }
}

export async function sendEmailGeneric(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  forceSmtp?: boolean;
}): Promise<{ success: boolean; provider: string; error?: string }> {
  const isEpitech = params.to.toLowerCase().endsWith('@epitech.digital');
  const isProfessional = isEpitech || params.forceSmtp;

  if (isProfessional) {
    const smtpKey = process.env.SMTP_KEY;
    const smtpUser = process.env.SMTP_USER || "contact@digizelle.fr";
    const smtpHost = process.env.SMTP_HOST || "ssl0.ovh.net";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    if (!smtpKey) {
      return await sendRawViaResend(params);
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpKey,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `"Digizelle" <${process.env.SMTP_FROM || smtpUser}>`,
        to: params.to,
        replyTo: "contact@digizelle.fr",
        subject: params.subject,
        html: params.html,
        text: params.text,
        attachments: isEpitech ? [] : [
          {
            filename: 'logo.png',
            content: Buffer.from(LOGO_BASE64, 'base64'),
            cid: 'digizelleLogo'
          }
        ]
      });
      console.log(`[Email-Generic] Succès OVH pour ${params.to}`);
      return { success: true, provider: "ovh" };
    } catch (err: any) {
      console.error("[Email-Generic] Échec OVH/SMTP :", err.message || err);
      return await sendRawViaResend(params);
    }
  } else {
    return await sendRawViaResend(params);
  }
}

async function sendRawViaResend(params: { to: string; subject: string; html: string; text: string }): Promise<{ success: boolean; provider: string; error?: string }> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) throw new Error("RESEND_API_KEY missing");

    const resend = new Resend(resendApiKey);
    const isEpitech = params.to.toLowerCase().endsWith('@epitech.digital');

    const { error } = await resend.emails.send({
      from: `"Digizelle" <${process.env.SMTP_FROM || "contact@digizelle.fr"}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments: isEpitech ? [] : [
        {
          filename: 'logo.png',
          content: Buffer.from(LOGO_BASE64, 'base64'),
          contentId: 'digizelleLogo'
        }
      ]
    });

    if (error) return { success: false, provider: "resend", error: error.message };
    return { success: true, provider: "resend" };
  } catch (err: any) {
    return { success: false, provider: "resend", error: err.message || String(err) };
  }
}

async function sendViaResend(data: ConfirmationEmailData, html: string, text: string): Promise<{ success: boolean; provider: string; error?: string }> {
  return sendRawViaResend({
    to: data.to,
    subject: `Confirmation d'inscription — ${EVENT.name}`,
    html: html,
    text: text
  });
}

export function buildApologyEmailHtml(data: { firstName: string }): string {
  const safeName = escapeHtml(data.firstName);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #FEF2F2; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1F2937;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FEF2F2;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; border-radius: 12px; overflow: hidden; background-color: #FFFFFF; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px; text-align: center; border-bottom: 2px solid #FEE2E2; background-color: #FFFBFB;">
              <img src="cid:digizelleLogo" alt="Digizelle" width="80" style="display: block; margin: 0 auto 16px; width: 80px;" />
              <p style="margin: 0; font-size: 11px; color: #DC2626; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                Nos excuses sincères
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; font-size: 22px; color: #24325F; font-weight: 700;">
                Bonjour ${safeName},
              </h2>
              
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Nous tenons à vous présenter nos sincères excuses.
              </p>

              <!-- Apology Box -->
              <div style="background-color: #FEE2E2; border-left: 4px solid #DC2626; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 28px;">
                <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #7F1D1D;">
                  ⚠️ Un dysfonctionnement technique identifié
                </p>
                <p style="margin: 0; font-size: 14px; color: #6B4423; line-height: 1.6;">
                  Ce matin, suite à un problème au niveau de nos serveurs OVH, una diffusion de masse d'emails a été relancée plusieurs fois, vous entraînant à recevoir de multiples copies du même message. Nous nous excusons sincèrement pour ce désagrément.
                </p>
              </div>

              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                <strong style="color: #24325F;">Déroulement :</strong><br/>
                • Dysfonctionnement détecté sur nos serveurs partenaires<br/>
                • Envoi de mails relancé plusieurs fois automatiquement<br/>
                • Vous avez reçu 5+ copies du même message<br/>
                • Le problème a été résolu et isolé
              </p>

              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                <strong style="color: #24325F;">Actions correctives :</strong><br/>
                ✓ Accès sécurisé rétabli<br/>
                ✓ Vérification complète des logs effectuée<br/>
                ✓ Mesures de prévention implémentées<br/>
                ✓ Infrastructure renforcée
              </p>

              <!-- Info Box -->
              <div style="background-color: #F8F7FF; border: 1px solid #E9E5FF; padding: 16px; border-radius: 8px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 14px; color: #4B5563; line-height: 1.6;">
                  <strong style="color: #7301FF;">À retenir :</strong> Vous pouvez ignorer les mails en doubles. Votre inscription au <strong>${escapeHtml(EVENT.name)}</strong> reste valide et confirmée pour le <strong>${escapeHtml(EVENT.displayDate)}</strong> à <strong>${escapeHtml(EVENT.location)}</strong>.
                </p>
              </div>

              <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter directement à <a href="mailto:contact@digizelle.fr" style="color: #7301FF; text-decoration: none; font-weight: 600;">contact@digizelle.fr</a>.
              </p>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${EVENT.mapsUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #7301FF 0%, #5B21B6 100%); color: #FFFFFF; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px;">
                      Voir les détails de l'événement &#8594;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #24325F; padding: 24px 32px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.8);">
                Merci pour votre compréhension et votre confiance,<br />
                <strong>L'équipe Digizelle</strong>
              </p>
            </td>
          </tr>

        </table>
        
        <p style="margin: 24px 0 0; font-size: 12px; color: #9CA3AF; text-align: center;">
          Cet email est une notification exceptionnelle concernant un incident technique récent.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildLiteApologyEmailHtml(data: { firstName: string }): string {
  const safeName = escapeHtml(data.firstName);
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #FEE2E2; border-left: 4px solid #DC2626; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <h2 style="color: #7F1D1D; margin-top: 0;">Nos excuses sincères</h2>
        <p style="margin: 0;">Bonjour ${safeName},</p>
      </div>
      
      <p>Suite à un dysfonctionnement au niveau de nos serveurs OVH, vous avez reçu ce matin plusieurs copies (5+) du même email. Nous nous excusons sincèrement pour ce désagrément.</p>
      
      <div style="background-color: #F8F7FF; border-left: 4px solid #7301FF; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Le problème a été identifié et résolu :</p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Dysfonctionnement des serveurs partenaires</li>
          <li>Les envois doublons sont supprimés</li>
          <li>Mesures de prévention implémentées</li>
        </ul>
      </div>
      
      <p><strong>Votre inscription reste active</strong> pour l'événement du <strong>${escapeHtml(EVENT.displayDate)}</strong> à <strong>${escapeHtml(EVENT.location)}</strong>.</p>
      
      <p>Questions ? Contactez-nous : <a href="mailto:contact@digizelle.fr" style="color: #7301FF; text-decoration: none;">contact@digizelle.fr</a></p>
      
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">Merci pour votre compréhension,<br>L'équipe Digizelle</p>
    </div>
  `;
}

/**
 * Force send via OVH SMTP only (no Resend fallback)
 * Used for retry of failed emails with strict guarantees
 */
export async function sendViaSmtpOnly(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ success: boolean; error?: string }> {
  const smtpKey = process.env.SMTP_KEY;
  const smtpUser = process.env.SMTP_USER || "contact@digizelle.fr";
  const smtpHost = process.env.SMTP_HOST || "ssl0.ovh.net";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  if (!smtpKey) {
    console.error("[SMTP-Only] ERREUR CRITIQUE: SMTP_KEY manquante!");
    return { success: false, error: "SMTP_KEY missing - cannot send" };
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

  try {
    console.log(`[SMTP-Only] Envoi forcé OVH pour ${params.to} (${smtpHost}:${smtpPort})`);

    await new Promise((resolve, reject) => {
      transporter.sendMail({
        from: `"Digizelle" <${process.env.SMTP_FROM || smtpUser}>`,
        to: params.to,
        replyTo: "contact@digizelle.fr",
        subject: params.subject,
        html: params.html,
        text: params.text,
      }, (err, info) => {
        if (err) reject(err);
        else resolve(info);
      });
    });

    console.log(`[SMTP-Only] ✅ Succès OVH pour ${params.to}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[SMTP-Only] ❌ FAILURE pour ${params.to}:`, err.message || err);
    return { success: false, error: err.message || String(err) };
  }
}
