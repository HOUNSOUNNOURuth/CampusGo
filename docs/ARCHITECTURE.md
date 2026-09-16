# Architecture — CampusGo

## 1. Vue d'ensemble

```
┌─────────────────────┐        ┌───────────────────────────────┐
│   React (Vite)       │  REST  │           Supabase             │
│   frontend statique   │◄──────►│  Postgres + Auth + RLS         │
│   (Vercel/Netlify)    │  JS SDK│  Edge Functions (Deno)         │
└─────────┬────────────┘        └───────────┬─────────────────────┘
          │                                  │
          │ navigator.geolocation            │ appel serveur → serveur
          ▼                                  ▼
   Position réelle de                  ┌───────────────┐
   l'utilisateur (GPS)                 │    Chariow     │
                                        │ (paiement)     │
                                        └───────────────┘
```

- Le frontend ne parle **jamais** directement à Chariow : il appelle une
  Edge Function Supabase, qui seule détient la clé secrète Chariow.
- Chariow confirme le paiement via un **webhook** vers une autre Edge Function,
  qui crédite alors le pack sur le compte de l'utilisateur.
- La sécurité des données (un utilisateur ne voit que ses propres recherches,
  paiements, etc.) est garantie par les policies **Row Level Security** de
  Postgres, pas par la logique du frontend.

## 2. Arborescence du projet

```
campusgo-app/
├── docs/                        # Documentation d'équipe
│   ├── ARCHITECTURE.md          # ce fichier
│   ├── DATA_MODEL.md            # schéma de données détaillé
│   └── TASKS.md                 # répartition des tâches (3 personnes)
│
├── supabase/
│   ├── migrations/0001_init.sql # tables + RLS + données de départ
│   └── functions/
│       ├── chariow-create-payment/   # crée un paiement + lien de checkout
│       └── chariow-webhook/          # reçoit la confirmation de paiement
│
├── src/
│   ├── main.jsx / App.jsx       # point d'entrée, providers globaux
│   ├── index.css                # design tokens (couleurs, typo)
│   │
│   ├── lib/
│   │   ├── supabaseClient.js    # client Supabase (clé publique anon)
│   │   └── chariow.js           # appelle la Edge Function de paiement
│   │
│   ├── context/
│   │   ├── AuthContext.jsx      # session utilisateur + profil
│   │   └── SearchQuotaContext.jsx # recherches gratuites / packs restants
│   │
│   ├── i18n/                    # dictionnaire FR/EN + contexte de langue
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useGeolocation.js    # position réelle (mode GPS) vs mode démo
│   │   └── useSearchHistory.js  # lecture/écriture table search_history
│   │
│   ├── routes/AppRouter.jsx     # /, /connexion, /inscription, /itineraire, /tableau-de-bord
│   │
│   ├── pages/                   # une page = un assemblage de composants
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx / SignupPage.jsx
│   │   ├── ItineraryPage.jsx    # page principale (carte + guide)
│   │   └── DashboardPage.jsx
│   │
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   ├── itinerary/           # CampusMap, AvatarGuide, InstructionCard,
│   │   │                        # StepsList, PhotoCard, SearchBar
│   │   ├── dashboard/           # StatCard, HistoryTable, PackCard
│   │   ├── payment/             # PricingCard, PaywallModal
│   │   └── ui/                  # Button, Input, LangToggle (design system)
│   │
│   ├── data/campusLocations.js  # lecture des lieux du campus (table Supabase)
│   └── utils/                   # geo.js (haversine, turnAt...), format.js
│
├── campusgo-maquette.html       # référence visuelle/comportementale validée
├── package.json / vite.config.js / index.html
└── .env.example
```

## 3. D'où vient chaque logique ?

La maquette HTML (`campusgo-maquette.html`) contient déjà, **en JavaScript
vanilla validé avec le client**, tout l'algorithme du guidage :

| Logique dans la maquette              | Doit être portée dans                        |
|----------------------------------------|-----------------------------------------------|
| `haversine`, `turnAt`, `bearingDir`     | `src/utils/geo.js`                             |
| `pickLandmarks`, `buildMessage`         | `CampusMap.jsx` (ou un `useItineraryEngine.js`)|
| `drawSvg`, `project`, `computeBounds`   | `CampusMap.jsx`                                |
| `travelLeg`, `startJourneyFromNode`     | `CampusMap.jsx` + `useGeolocation.js`          |
| `showNodeState`, `showPhoto`            | `InstructionCard.jsx` + `PhotoCard.jsx`        |
| dictionnaire `dict` FR/EN               | `src/i18n/fr.json` / `en.json`                 |
| compteur recherches gratuites + modale  | `SearchQuotaContext.jsx` + `PaywallModal.jsx`  |

**Ne pas réinventer cette logique** : elle a déjà été testée et validée avec
le client dans la maquette. Le travail consiste à la traduire en composants
React connectés à Supabase (données dynamiques au lieu de tableaux figés).

## 4. Décisions techniques à respecter

- **Carte** : rester sur une carte **dessinée en SVG** (pas de tuiles
  externes type Leaflet/Google Maps) — c'est un choix délibéré suite à un bug
  de chargement, et ça évite toute dépendance/clé API supplémentaire pour un
  campus dont le tracé est fixe et connu à l'avance.
- **Progression** : ne jamais ajouter de bouton "Suivant" manuel. La
  progression doit être déclenchée soit par le mode démo (minuterie), soit
  par la géolocalisation réelle — jamais par un clic.
- **Clé Chariow** : uniquement dans les secrets Supabase Edge Functions,
  jamais dans une variable `VITE_...` (qui finirait dans le bundle public).
