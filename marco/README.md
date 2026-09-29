# MARCO — ton pote qui a tout fait à Paris

Web app mobile (PWA) prête à devenir une application iOS / Android.
L'utilisateur dit ce qu'il veut faire, Marco construit le plan.

## Fonctionnalités

| Écran | Ce qu'il fait |
|---|---|
| **Onboarding** | Prénom, quartier où l'on vit/dort, goûts (caché, bobo, jazz, date…) |
| **Accueil** | Pépites cachées près de chez toi, "Rien que pour toi", coups de cœur, rue du jour |
| **Marco (IA)** | Chat avec la mascotte : plans, adresses, histoire des rues. Les lieux cités s'ouvrent en fiche avec bouton de réservation |
| **Raconte-moi une rue** | Tape une rue → son histoire, un fait historique daté, une anecdote drôle, et les adresses à deux pas |
| **Planificateur** | 5 questions (qui, durée, envies, budget, quartier) → itinéraire horodaté, trajets à pied/métro, réservations, enregistrer/partager |
| **Explorer** | Recherche, filtres par catégorie / mood / pépites cachées |
| **Carte** | Tous les lieux et les rues racontées sur une carte (OpenStreetMap, sans clé) |
| **Profil** | Goûts, quartier, enregistrements, plans, rues découvertes, historique |
| **Voyages** (bientôt) | Aperçu de séjour multi-jours + liste d'attente : la future réservation de voyage complète |

Données : `src/data/spots.ts` (35 adresses, dont beaucoup cachées) et `src/data/streets.ts` (28 rues). Pour en ajouter, il suffit de compléter ces fichiers.

## Lancer en local

```bash
cd marco
npm install
cp .env.example .env   # puis colle ta clé ANTHROPIC_API_KEY (optionnel)
npm run dev            # http://localhost:5174
```

- **Sans clé** : Marco tourne en mode local (réponses construites à partir de sa base d'adresses et de rues).
- **Avec clé** : l'IA (Claude) répond à tout, raconte n'importe quelle rue de Paris et affine les plans. La clé reste côté serveur (`server/marco.ts`), jamais dans le navigateur.

## Mettre en ligne

Le projet est prêt pour **Vercel** : importer le repo, choisir `marco` comme *Root Directory*, ajouter la variable d'environnement `ANTHROPIC_API_KEY`. La fonction `api/marco.ts` sert l'IA et `vercel.json` gère les routes.

## En faire une application (App Store / Play Store)

1. Tout de suite : ouvrir le site sur son téléphone → "Ajouter à l'écran d'accueil". Marco s'ouvre en plein écran comme une app (PWA).
2. Pour les stores, emballer le site avec [Capacitor](https://capacitorjs.com) :
   ```bash
   npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
   npx cap init Marco app.marco.paris --web-dir dist
   npm run build && npx cap add ios && npx cap add android
   npx cap open ios   # ou android
   ```
   En mode app, faire pointer les appels `/api/marco` vers l'URL du site déployé.

## Prochaines étapes suggérées

- Brancher les programmes d'affiliation (GetYourGuide, Viator, TheFork) : les boutons "Réserver" pointent aujourd'hui vers leur recherche.
- Comptes utilisateurs + base de données (les données sont pour l'instant stockées sur l'appareil).
- Photos réelles des lieux (les visuels actuels sont des illustrations générées).
- Import de posts TikTok / Instagram, "Plan Together" à plusieurs, multi-villes (V2/V3 du document).
