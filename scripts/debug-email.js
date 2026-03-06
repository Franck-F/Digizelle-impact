const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const fs = require("fs");
const path = require("path");

// Manually load .env.local
const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envLines = envContent.split("\n");
const envVars = {};
envLines.forEach(line => {
    const [key, val] = line.split("=");
    if (key && val) envVars[key.trim()] = val.trim();
});

const targetEmail = "bleuenn.cloteaux@epitech.digital";

async function testOVH() {
    console.log(`--- Testing OVH SMTP for ${targetEmail} ---`);
    const transporter = nodemailer.createTransport({
        host: envVars.SMTP_HOST || "ssl0.ovh.net",
        port: parseInt(envVars.SMTP_PORT) || 465,
        secure: true,
        auth: {
            user: envVars.SMTP_USER || "contact@digizelle.fr",
            pass: envVars.SMTP_KEY,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Digizelle Test OVH" <${envVars.SMTP_FROM || envVars.SMTP_USER}>`,
            to: targetEmail,
            subject: "DEBUG: Test OVH Delivery",
            text: "This is a test email sent via OVH to verify delivery to Epitech.",
        });
        console.log("OVH SUCCESS:", info.messageId);
    } catch (err) {
        console.error("OVH FAILED:", err.message);
    }
}

async function testResend() {
    console.log(`--- Testing Resend API for ${targetEmail} ---`);
    if (!envVars.RESEND_API_KEY) {
        console.error("Resend API Key missing");
        return;
    }
    const resend = new Resend(envVars.RESEND_API_KEY);
    try {
        const { data, error } = await resend.emails.send({
            from: `"Digizelle Test Resend" <${envVars.SMTP_FROM || "contact@digizelle.fr"}>`,
            to: targetEmail,
            subject: "DEBUG: Test Resend Delivery",
            text: "This is a test email sent via Resend to verify delivery to Epitech.",
        });
        if (error) {
            console.error("Resend FAILED (API Error):", error.message);
        } else {
            console.log("Resend SUCCESS:", data.id);
        }
    } catch (err) {
        console.error("Resend FAILED (Exception):", err.message);
    }
}

async function run() {
    await testOVH();
    console.log("\n");
    await testResend();
}

run();
