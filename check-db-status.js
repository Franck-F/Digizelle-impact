const { neon } = require("@neondatabase/serverless");
const fs = require('fs');

const DATABASE_URL = "postgresql://neondb_owner:npg_R9tkfwoPd2rZ@ep-dark-snow-agca2gim-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

async function checkLastRegistration() {
    const sql = neon(DATABASE_URL);
    try {
        const rows = await sql`
      SELECT id, first_name, last_name, email, email_status, email_provider, email_error, registered_at
      FROM registrations
      ORDER BY registered_at DESC
      LIMIT 10
    `;

        fs.writeFileSync('db-status.json', JSON.stringify(rows, null, 2));
        console.log("Status written to db-status.json");
    } catch (err) {
        console.error("Erreur DB:", err);
    }
}

checkLastRegistration();
