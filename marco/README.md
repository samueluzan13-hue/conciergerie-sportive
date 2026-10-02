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
| **Carte** | Carte de Paris dessinée (Seine, périphérique, monuments) avec les lieux et les rues racontées ; zoom et déplacement au doigt |
| **Profil** | Goûts, quartier, enregistrements, plans, rues découvertes, historique |
| **Voyages** (bientôt) | Aperçu de séjour multi-jours + liste d'attente : la future réservation de voyage complète |
| **Base de données** (`/base`, éditeurs) | Ajouter / modifier / supprimer lieux et rues, traiter les propositions |
| **Proposer une pépite** | Les utilisateurs envoient une adresse, elle arrive dans les propositions |
| **Sortir ce soir** (`/soirees`) | L'ambiance nocturne et les lieux de chaque arrondissement (1er → 20e), liens programme et itinéraire |
| **Activités** | 40 activités réservables : bateau, piscines Art déco, ateliers et dégustations, sport, visites insolites, musées de niche, sorties en famille |
| **Réservation** | Bouton « Réserver une table » sur tous les restaurants, « Réserver l'activité » sur toutes les activités |
| **Photos** | Photo réelle de chaque lieu : sur le site, via l'API officielle Google Places (`GOOGLE_MAPS_API_KEY`, route `/api/photo`) ; dans l'aperçu, ajoutées par les éditeurs depuis la fiche (« Ajouter une photo »). Sinon, l'illustration Marco |
| **Casher & halal** | Uniquement sur demande dans le chat : quartiers où chercher et adresses, avec rappel de vérifier la certification |

Données : `src/data/spots.ts` + `src/data/spots-extra.ts` + `spots-restos.ts` + `spots-activites.ts` (196 lieux : 88 restaurants, 40 activités, bars, cafés, culture, nature, insolite), `src/data/guides.ts` (soirées par arrondissement, quartiers casher / halal) et `src/data/streets.ts` (28 rues). Pour en ajouter, il suffit de compléter ces fichiers.

## Annuaire des voies de Paris

`src/data/voies.json` référence les rues, avenues, boulevards, places, quais et passages de Paris (recherche tolérante, liste par arrondissement, fiche par voie racontée par Marco). Il est construit par `node scripts/build-voies.mjs` à partir de :

1. `scripts/voies-initiales.txt` : première liste saisie à la main (≈1 300 voies) ;
2. `scripts/voies-officielles.json` (optionnel) : l'export JSON du jeu de données officiel **« Dénominations des emprises des voies actuelles »** d'opendata.paris.fr, qui apporte **toutes** les voies avec l'origine du nom et l'historique. Déposer le fichier puis relancer le script.

## 9 villes

Paris, Madrid, Barcelone, Londres, Lisbonne, Rome, Amsterdam, New York et Berlin. Le choix de la ville (en haut de l'accueil, d'Explorer, de la carte…) change toute l'app : lieux, carte dessinée, soirées par quartier, rues racontées, casher / halal et l'IA. Les données des autres villes sont dans `src/data/world/<ville>.ts`, la ville elle-même (quartiers, plan, aéroport) dans `src/data/cities.ts`.

## Vols, hôtels et appartements réservables dans Marco

Onglet **Voyages** : vols (tri moins cher, plus cher, plus rapide, meilleur compromis, direct uniquement), hôtels et appartements de chaque ville avec chambres et tarifs, puis réservation sans quitter l'app. Côté serveur, `server/travel.ts` (route `/api/voyage`) utilise [Duffel](https://duffel.com) : compagnies aériennes en direct et hébergements (Duffel Stays). Variables : `DUFFEL_ACCESS_TOKEN`, `DUFFEL_STAYS=1`, `MARCO_BOOKING=1` (voir `.env.example`). Sans serveur (aperçu claude.ai), un **mode démonstration** clairement signalé permet de tester le parcours sans rien réserver.

Avant d'ouvrir la réservation au public : encaisser le client (Stripe ou Duffel Payments) avant de créer la commande, car Duffel prélève le solde de l'entreprise. Airbnb n'ouvre ses logements à aucune application tierce : l'onglet Apparts propose les appartements et résidences des partenaires de réservation.

**Séjour sur mesure** : ville, dates, voyageurs, budget, rythme et envies → programme jour par jour construit avec les adresses Marco, budget estimé, puis Marco (IA) écrit le séjour complet ; vol et hébergement se réservent ensuite en deux gestes, et le séjour s'enregistre dans le profil.

## Réservation par Marco (agent vocal)

Quand l'utilisateur demande à réserver, l'IA prépare une **carte de réservation** dans le chat (lieu, jour, heure, personnes). L'utilisateur ajoute son nom et son téléphone, confirme, et :

- **Sur le site en ligne, avec l'agent vocal configuré** : `server/voice.ts` (route `/api/appel`) fait appeler le restaurant par un assistant vocal [Vapi](https://vapi.ai) propulsé par Claude. Le numéro vient toujours de la fiche Google du restaurant (jamais d'un numéro saisi), uniquement des numéros français non surtaxés, entre 10 h et 22 h (sinon l'appel est programmé au lendemain 10 h). L'agent se présente comme assistant vocal, ne donne jamais de carte bancaire, n'accepte un autre horaire qu'à 30 min près. À la fin, Vapi analyse l'appel (confirmée, autre horaire, complet, pas de réponse, à rappeler) et l'app affiche le résultat en direct, puis dans **Profil › Mes réservations**.
- **Dans l'aperçu claude.ai** : la demande part dans la collection `reservations` et l'équipe la traite depuis **Base de données › Réservations**.

Mise en route de l'agent vocal : compte Vapi, numéro français importé (Twilio, Vonage ou Telnyx), puis `VAPI_API_KEY`, `VAPI_PHONE_NUMBER_ID`, `GOOGLE_MAPS_API_KEY` et `MARCO_AUTO_CALL=1` (voir `.env.example`). Sans `MARCO_AUTO_CALL`, seuls les appels portant l'en-tête `x-marco-admin: $MARCO_ADMIN_TOKEN` sont acceptés. Avant l'ouverture au grand public : comptes utilisateurs et limiteur d'appels partagé (le garde-fou actuel est par instance du serveur).

## Base de données

- **Aperçu claude.ai** : la page utilise la base intégrée (`src/lib/cloud.ts`) : collections `lieux`, `rues`, `suggestions`, `recits` (histoires de rues écrites une fois par l'IA puis partagées), et un document privé par utilisateur (`data/users/<id>/etat` : profil, favoris, plans, historique). Seuls les éditeurs modifient `lieux` et `rues`.
- **Site classique** : sans base branchée, l'app utilise les données intégrées et l'appareil de l'utilisateur. Pour la production, brancher une base (Supabase, Firebase…) derrière les mêmes fonctions de `src/lib/cloud.ts`.

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
