const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

// Load environment variables manually from .env.local
const envPath = path.join(__dirname, "..", ".env.local");
console.log(`📁 Looking for .env.local at: ${envPath}`);

if (fs.existsSync(envPath)) {
  console.log("✅ .env.local found, loading variables...");
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    // Skip comments and empty lines
    if (line.trim().startsWith("#") || line.trim() === "") return;
    
    const equalIndex = line.indexOf("=");
    if (equalIndex > 0) {
      const key = line.substring(0, equalIndex).trim();
      let value = line.substring(equalIndex + 1).trim();
      
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      if (!process.env[key]) {
        process.env[key] = value;
        if (key === "DATABASE_URL") {
          console.log("✅ DATABASE_URL loaded");
        }
      }
    }
  });
} else {
  console.error("❌ .env.local file not found");
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const emailsToCheck = [
  "alex-40390@hotmail.fr",
  "anais.albath@databricks.com"
];

async function checkRegistrations() {
  console.log("🔍 Vérification des inscriptions...\n");

  for (const email of emailsToCheck) {
    console.log(`📧 Email: ${email}`);
    
    try {
      const results = await sql`
        SELECT id, email, first_name, last_name, type, company, school, email_status, email_provider, email_error, registered_at as created_at
        FROM registrations
        WHERE email = ${email}
      `;

      if (results.length === 0) {
        console.log("   ❌ Non trouvé dans la base de données");
      } else {
        const user = results[0];
        console.log("   ✅ Trouvé dans la base de données");
        console.log(`   - ID: ${user.id}`);
        console.log(`   - Nom: ${user.first_name} ${user.last_name}`);
        console.log(`   - Type: ${user.type}`);
        console.log(`   - Entreprise/École: ${user.company || user.school || "N/A"}`);
        console.log(`   - Email Status: ${user.email_status}`);
        console.log(`   - Email Provider: ${user.email_provider}`);
        if (user.email_error) {
          console.log(`   - Email Error: ${user.email_error}`);
        }
        console.log(`   - Inscrit le: ${new Date(user.created_at).toLocaleString("fr-FR")}`);
      }
    } catch (error) {
      console.error(`   ⚠️ Erreur lors de la recherche: ${error.message}`);
    }
    
    console.log("");
  }
}

checkRegistrations()
  .then(() => {
    console.log("✅ Vérification terminée");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
