# Répartition des tâches — 3 personnes

## Sêyidè BEHANZIN — Carte & guidage (le plus critique)
Fichiers concernés :
- `src/components/Map/MapSVG.jsx`
- `src/components/Map/RouteRenderer.jsx`
- `src/components/Robot/RobotGuide.jsx`
- `src/hooks/useGeolocation.js`
- `src/hooks/useRobotGuide.js`
- `src/data/campusMap.js`

À faire :
1. Dessiner la carte SVG du campus (nœuds/repères + segments).
2. Faire en sorte que le tracé tourne visiblement à chaque `turn_direction`
   (jamais de ligne droite entre deux repères éloignés).
3. Implémenter la logique GPS réelle (distance utilisateur ↔ prochain repère)
   et le mode Démo (délai simulé) dans `useRobotGuide`.
4. Animer le robot le long du tracé calculé.
5. Tester le mode GPS réel directement sur le campus (téléphone en main) pour
   calibrer le seuil de proximité, et vérifier le rendu sur mobile.

## HOUSSOU Joaddane — Interface, pages & contenu (UI complète + i18n)
Fichiers concernés :
- `src/components/UI/InfoCard.jsx`
- `src/components/UI/PlayPauseButton.jsx`
- `src/components/UI/StepsList.jsx`
- `src/components/UI/Button.jsx`, `Input.jsx`, `LangToggle.jsx`
- `src/components/dashboard/StatCard.jsx`, `HistoryTable.jsx`, `PackCard.jsx`
- `src/components/payment/PaywallModal.jsx`, `PricingCard.jsx`
- `src/pages/Home.jsx`
- `src/pages/Itinerary.jsx`
- `src/pages/Destination.jsx`
- `src/pages/LoginPage.jsx`, `SignupPage.jsx`, `DashboardPage.jsx`
- `src/styles/global.css`
- `src/i18n/fr.json`, `en.json`, `I18nContext.jsx`

À faire :
1. Carte flottante `InfoCard` : message contextuel ("Vous êtes actuellement
   à... continuons vers...") + photo du lieu affichée 3-4 secondes, puis
   persistante à l'arrivée finale.
2. Écran de choix de destination (`Home.jsx`) : hero, "comment ça marche",
   tarifs, footer.
3. Liste des étapes flottante qui défile automatiquement (`StepsList.jsx`).
4. Bouton rond Play/Pause (le seul contrôle utilisateur, pas de bouton
   "Suivant").
5. Écran d'arrivée avec message + photo persistante (`Destination.jsx`).
6. Habillage des pages Connexion/Inscription/Tableau de bord (la logique
   vient de HOUNSOUNNOU Ruth, l'écran vient d'ici).
7. Modale de tarifs `PaywallModal`/`PricingCard`, identique à la maquette.
8. Compléter `fr.json`/`en.json` avec toutes les clés déjà validées dans la
   maquette (`campusgo-maquette.html`).
9. Vérifier le responsive et l'accessibilité (contrastes, labels, focus
   clavier) sur toutes les pages.

## HOUNSOUNNOU Ruth — Backend Supabase, Auth, Paiement & Déploiement
Fichiers concernés :
- `supabase/schema.sql`
- `supabase/seed.sql`
- `supabase/migrations/0001_init.sql`
- `supabase/functions/chariow-create-payment/`
- `supabase/functions/chariow-webhook/`
- `src/services/supabaseClient.js`
- `src/services/itineraryService.js`
- `src/services/placesService.js`
- `src/services/chariowService.js`
- `src/hooks/useItinerary.js`
- `src/hooks/useAuth.js`
- `src/hooks/useSearchHistory.js`
- `src/context/ItineraryContext.jsx`
- `src/context/AuthContext.jsx`
- `src/context/SearchQuotaContext.jsx`

À faire :
1. Créer les tables `places`, `routes`, `route_steps` (+ migrations).
2. Charger les photos des lieux dans Supabase Storage et renseigner
   `photo_url`.
3. Écrire les services de récupération (itinéraire complet avec ses étapes
   ordonnées, lieu par id).
4. Exposer l'itinéraire courant via `ItineraryContext` pour que les
   composants de Sêyidè et Joaddane le consomment.
5. Authentification : inscription/connexion/déconnexion, route protégée,
   mot de passe oublié.
6. Quota de recherches gratuites et packs : `SearchQuotaContext`, logique de
   vérification avant chaque recherche, données réelles du tableau de bord.
7. Paiement Chariow : adapter les Edge Functions aux vraies clés API,
   tester le parcours complet en sandbox (paiement → webhook → pack crédité),
   gérer les échecs et les doublons de webhook.
8. **Déploiement** : mise en ligne du frontend (Vercel/Netlify), configuration
   des variables d'environnement (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`),
   déploiement des Edge Functions (`supabase functions deploy`), secrets
   Chariow (`supabase secrets set`), et vérification qu'aucune clé secrète ne
   se trouve dans le code du frontend avant la mise en ligne.

## Points de synchronisation entre les 3
- Le format exact d'une "étape" (`route_step`) doit être figé en premier —
  c'est le contrat entre Ruth (qui le fournit) et Sêyidè/Joaddane (qui le
  consomment) : `{ place_name, photo_url, x, y, turn_direction, instruction }`.
- Le seuil de proximité GPS (ex: 15-20 mètres) est à définir ensemble entre
  Ruth/Sêyidè (géoloc) et Joaddane (UX — délai d'affichage du message).
- La forme du retour de `SearchQuotaContext` (ex: `canSearch: false`) doit
  être connue de Joaddane pour déclencher correctement l'ouverture de
  `PaywallModal`.