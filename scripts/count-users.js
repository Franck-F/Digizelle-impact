const { getDb } = require("./src/lib/db");
async function count() {
    const sql = getDb();
    const res = await sql`SELECT count(*) FROM registrations`;
    console.log("TOTAL_REGISTRANTS:", res[0].count);
    process.exit(0);
}
count();
