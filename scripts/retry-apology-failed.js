/**
 * Retry apology emails via OVH SMTP ONLY for addresses that failed on first attempt
 * STRICT SECURITY: Will reject any email that was already successfully sent
 * 
 * Usage: node scripts/retry-apology-failed.js
 */

const http = require('http');

// Hardcoded list of 17 emails that failed on first attempt
const FAILED_EMAILS = [
    "carmelinagracelucia.mbesso@skema.edu",
    "larissa.djonkouedjankou@skema.edu",
    "audreygodjo@gmail.com",
    "vanessasolari@hotmail.fr",
    "axmbesso.am@gmail.com",
    "gouriiyad624@gmail.com",
    "nolwenn.bourey@protonmail.com",
    "grace-patricia.mime@newdeal-founders.org",
    "leo.balloch@epitech.eu",
    "yann.meza-demehz-bastion@epita.fr",
    "yoelanati.guiademkamgaing@essca.eu",
    "charles-henry.noah@epitech.digital.com",
    "m.khan@euridis.net",
    "badis.akcha@gmail.com",
    "vakouaudrey@gmail.com",
    "said-mounir.zayad@sorbonne-nouvelle.fr",
    "priscilliamezasamira@gmail.com"
];

const apiUrl = process.env.API_URL || 'http://localhost:3000';
const adminToken = process.env.ADMIN_TOKEN || 'digizelle-admin-2026';

async function retryFailedApology() {
    try {
        const payload = JSON.stringify({ emails: FAILED_EMAILS });
        
        console.log('🚀 RETRY APOLOGY - OVH SMTP STRICT\n');
        console.log(`📧 Emails à renvoyer: ${FAILED_EMAILS.length}`);
        console.log(`🔗 API: ${apiUrl}/api/admin/apology-broadcast/retry`);
        console.log(`🔐 Mode: OVH SMTP UNIQUEMENT (pas de Resend fallback)`);
        console.log('');

        const url = new URL(`${apiUrl}/api/admin/apology-broadcast/retry`);
        
        const options = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
                'Authorization': `Bearer ${adminToken}`,
            },
        };

        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        
                        console.log('✅ Réponse:\n');
                        console.log(JSON.stringify(result, null, 2));
                        
                        if (result.success) {
                            console.log(`\n✨ Résultat final:`);
                            console.log(`   ✅ Succès: ${result.result.success}/${result.result.total}`);
                            console.log(`   ❌ Échoué: ${result.result.failed}/${result.result.total}`);
                            
                            if (result.result.errors.length > 0) {
                                console.log(`\n⚠️  Erreurs détectées:`);
                                result.result.errors.forEach((err) => {
                                    console.log(`   - ${err.email}: ${err.error}`);
                                });
                            }
                            resolve(0);
                        } else {
                            console.error(`\n❌ Erreur: ${result.error}`);
                            resolve(1);
                        }
                    } catch (e) {
                        console.error('❌ Erreur parsing:', e.message);
                        console.error('Réponse brute:', data);
                        resolve(1);
                    }
                });
            });

            req.on('error', (e) => {
                console.error('❌ Erreur requête:', e.message);
                reject(e);
            });

            req.write(payload);
            req.end();
        });
    } catch (err) {
        console.error('❌ Erreur fatale:', err);
        return 1;
    }
}

console.log(`\n╔════════════════════════════════════════════════╗`);
console.log(`║  RETRY APOLOGY EMAILS - OVH SMTP STRICT MODE  ║`);
console.log(`╚════════════════════════════════════════════════╝\n`);

retryFailedApology()
    .then(code => process.exit(code))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
