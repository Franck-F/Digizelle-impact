import { getDb } from "../src/lib/db";

const emailsToCheck = [
  "alex-40390@hotmail.fr",
  "anais.albath@databricks.com"
];

async function checkRegistrations() {
  console.log("🔍 Vérification des inscriptions...\n");
  
  const sql = getDb();

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
