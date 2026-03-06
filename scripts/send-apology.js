/**
 * Script to send apology emails due to OVH server outage
 * Usage: node scripts/send-apology.js [TEST_EMAIL]
 * 
 * Example:
 *   node scripts/send-apology.js                    # Send to all
 *   node scripts/send-apology.js test@example.com   # Test email
 */

const http = require('http');

// Get test email from command line args
const testEmail = process.argv[2];
const apiUrl = process.env.API_URL || 'http://localhost:3000';
const adminToken = process.env.ADMIN_TOKEN || 'digizelle-admin-2026';

async function sendApologyBroadcast() {
  try {
    const payload = testEmail ? JSON.stringify({ testEmail }) : '{}';
    
    console.log('🚀 Démarrage de l\'envoi d\'email d\'excuses...\n');
    console.log(`📧 Mode: ${testEmail ? `TEST (${testEmail})` : 'PRODUCTION (tous les inscrits)'}`);
    console.log(`🔗 API: ${apiUrl}/api/admin/apology-broadcast`);
    console.log(`🔑 Token: ${adminToken.substring(0, 10)}...`);
    console.log('');

    const url = new URL(`${apiUrl}/api/admin/apology-broadcast`);
    
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
            
            console.log('✅ Réponse reçue:\n');
            console.log(JSON.stringify(result, null, 2));
            
            if (result.success) {
              console.log(`\n✨ Succès! ${result.result.success} emails envoyés, ${result.result.failed} échoués.`);
              if (result.result.errors.length > 0) {
                console.log('\n⚠️  Erreurs:');
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
            console.error('❌ Erreur de parsing:', e.message);
            console.error('Réponse brute:', data);
            resolve(1);
          }
        });
      });

      req.on('error', (e) => {
        console.error('❌ Erreur de requête:', e.message);
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

sendApologyBroadcast()
  .then(code => process.exit(code))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
