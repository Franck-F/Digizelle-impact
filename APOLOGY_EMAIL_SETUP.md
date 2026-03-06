# 🙏 Système d'Email d'Excuses - Bug OVH

## Situation

Suite à un dysfonctionnement des serveurs OVH ce matin, une diffusion de mass email a été relancée plusieurs fois automatiquement, causant l'envoi de **5+ copies du même email** à tous les inscrits.

## Solution implémentée

J'ai créé un système complet pour envoyer un email d'excuses à tous les inscrits:

### 📨 Email d'excuses

L'email inclut:
- **Excuses sincères** pour le désagrément
- **Explication technique**: dysfonctionnement des serveurs OVH
- **Chronologie** des événements
- **Actions correctives** prises
- **Confirmation** que l'inscription reste valide
- **Contact direct** pour questions/préoccupations

### 📁 Fichiers modifiés/créés

```
src/
├── lib/
│   ├── email.ts           ✏️ Modifié - Ajout de buildApologyEmailHtml() et buildLiteApologyEmailHtml()
│   └── broadcast.ts       ✏️ Modifié - Ajout de sendApologyBroadcast()
├── app/api/admin/
│   └── apology-broadcast/
│       └── route.ts       ✨ Nouveau - Endpoint API pour déclencher l'envoi
└── scripts/
    └── send-apology.js    ✨ Nouveau - Script CLI pour envoyer les excuses
```

## 🚀 Comment envoyer les emails d'excuses

### Option 1: Via curl (recommandé pour production)

```bash
# Test d'abord avec une adresse email
curl -X POST http://localhost:3000/api/admin/apology-broadcast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer digizelle-admin-2026" \
  -d '{"testEmail":"test@example.com"}'

# Envoi à TOUS les inscrits
curl -X POST http://localhost:3000/api/admin/apology-broadcast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer digizelle-admin-2026" \
  -d '{}'
```

### Option 2: Via Node.js script

```bash
# Test avec une adresse
node scripts/send-apology.js test@example.com

# Envoi à tous
node scripts/send-apology.js
```

### Option 3: Via client HTTP/Postman

```
POST http://localhost:3000/api/admin/apology-broadcast

Headers:
- Content-Type: application/json
- Authorization: Bearer digizelle-admin-2026

Body (test):
{
  "testEmail": "test@example.com"
}

Body (production):
{}
```

## ⚙️ Configuration requise

L'endpoint utilise les variables d'environnement suivantes:

```env
ADMIN_TOKEN=digizelle-admin-2026          # Token d'authentification (obligatoire)
DATABASE_URL=postgresql://...             # Connexion à la base de données
RESEND_API_KEY=...                        # Clé API Resend (fallback)
SMTP_HOST=ssl0.ovh.net                    # Serveur SMTP OVH
SMTP_PORT=465                             # Port SMTP
SMTP_USER=contact@digizelle.fr            # Utilisateur SMTP
SMTP_KEY=...                              # Mot de passe SMTP OVH
```

## 📊 Réponse de l'API

```json
{
  "success": true,
  "message": "Diffusion d'excuses terminée pour 42 contacts.",
  "result": {
    "total": 42,
    "success": 40,
    "failed": 2,
    "errors": [
      {
        "email": "invalid@test.com",
        "error": "Invalid email"
      }
    ]
  }
}
```

## 🔒 Sécurité

- ✅ Authentification par token (`ADMIN_TOKEN`)
- ✅ Uniquement accessible via POST
- ✅ Les emails sont envoyés avec délai (1s) pour respecter rate limits
- ✅ Logging complète de chaque tentative d'envoi
- ✅ Gestion d'erreurs robuste

## 📋 Étapes recommandées

1. **Tester d'abord** avec une adresse email
   ```bash
   node scripts/send-apology.js your-email@example.com
   ```

2. **Vérifier** que vous recevez le mail correctement et que le formatage est bon

3. **Envoyer à la production** une fois satisfait
   ```bash
   node scripts/send-apology.js
   ```

4. **Surveiller** les logs pour détecter d'éventuels problèmes

## 📝 Détails techniques

### Email rendu

L'email s'adapte selon le type d'adresse:
- **Emails @epitech.digital**: Version lite sans logo (HTML allégé)
- **Autres emails**: Version complète avec logo Digizelle (HTML riche)

### Gestion des erreurs

Si l'envoi via SMTP OVH échoue, le système bascule automatiquement sur Resend (fallback).

### Rate limiting

Un délai de 1000ms est respecté entre chaque envoi pour:
- Respecter les limite de Resend (free tier: 1 email/seconde)
- Éviter de surcharger le serveur de destination

## ✨ Conclusion

L'infrastructure est maintenant en place pour:
1. Envoyer des emails d'excuses
2. Tracker le succès/échec de chaque envoi
3. Gérer les erreurs gracieusement
4. Faciliter les tests avant production

**Tous les inscrits peuvent maintenant recevoir un mail expliquant le bug et confirmant que leur inscription est toujours valide! 🎯**
