# Mettre Marco en ligne avec la réservation 100 % automatique

Sur claude.ai, Marco ne peut ni appeler, ni envoyer de SMS, ni garder les réservations à l'abri des clients.
Sur ton propre site, tout se fait tout seul :

1. le client confirme « Réserver avec Marco » → il reçoit un code Marco et un SMS « demande enregistrée » ;
2. l'agent vocal de Marco appelle le resto / l'activité, dans la langue de la ville ;
3. à la fin de l'appel, la réservation passe en « confirmée » ou « impossible » et le client reçoit le SMS ;
4. si personne ne décroche ou si le lieu exige un acompte, la demande reste « à traiter » dans l'espace équipe.

Les clients ne voient que leur propre réservation (grâce à leur code). Toi seul vois tout, avec ta clé admin,
sur `https://ton-site/base`.

## 1. Mettre le site en ligne (Vercel, gratuit pour commencer)
1. Crée un compte sur vercel.com avec ton GitHub.
2. « Add New › Project » → choisis le dépôt `conciergerie-sportive`, dossier racine `marco`.
3. Déploie. Ton site est en ligne (ex. `marco-xxx.vercel.app`, tu pourras brancher ton nom de domaine).

## 2. Les réglages (Vercel › Project › Settings › Environment Variables)

| Variable | Rôle | Où la trouver |
|---|---|---|
| `MARCO_ADMIN_TOKEN` | ta clé admin (mot de passe de l'espace équipe) | invente une longue phrase secrète |
| `PUBLIC_URL` | l'adresse de ton site | ex. `https://marco-xxx.vercel.app` |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | la base privée des réservations | Vercel › Storage › Upstash Redis (gratuit) |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | les SMS (`TWILIO_FROM` = `Marco` ou ton numéro Twilio) | twilio.com (≈ 0,08 € / SMS en France) |
| `VAPI_API_KEY`, `VAPI_PHONE_NUMBER_ID` | l'agent vocal qui appelle les lieux | vapi.ai (≈ 0,10 à 0,20 € / minute) |
| `GOOGLE_MAPS_API_KEY` | trouver le numéro officiel de chaque lieu | console.cloud.google.com › Places API |
| `ANTHROPIC_API_KEY` | l'IA de Marco dans le chat | console.anthropic.com |

Sans Vapi, les réservations arrivent quand même dans l'espace équipe et les SMS partent dès que tu cliques
« Confirmée » ou « Impossible ». Avec Vapi, plus aucune action n'est nécessaire.

## 3. Ce qu'il faut savoir
- L'agent vocal se présente toujours comme l'assistant automatique de Marco, n'appelle qu'entre 10 h et 22 h
  (heure locale de la ville), ne donne jamais de carte bancaire et ne réserve pas si un acompte est exigé.
- Les hôtels ne sont pas appelés automatiquement : la demande arrive à l'équipe (ou le client réserve sur le site
  officiel de l'hôtel).
- Les SMS sont des messages de service (pas de publicité) : expéditeur Marco identifié, pas de mention STOP requise.
