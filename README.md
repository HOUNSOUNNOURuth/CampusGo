# CampusGo

Application de guidage sur le campus de l'Université d'Abomey-Calavi (UAC),
en React + Supabase. Guide un utilisateur vers un lieu du campus avec un
itinéraire pas-à-pas, un avatar/robot qui se déplace en fonction de sa
progression réelle, en français et en anglais.

## Documents à lire en premier

1. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — vue d'ensemble technique et arborescence du projet.
2. [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — schéma de la base de données Supabase.
3. [`docs/TASKS.md`](docs/TASKS.md) — **répartition des tâches entre les 3 personnes de l'équipe**.

La maquette statique validée (`campusgo-maquette.html`) reste la référence
visuelle et comportementale : chaque logique qu'elle contient (calcul
d'itinéraire, tourne-à-gauche/droite, attente du déplacement réel, carte-photo)
doit être **portée** dans les composants React correspondants, pas réinventée.

## Démarrage rapide

```bash
npm install
cp .env.example .env.local   # puis remplir les clés Supabase
npm run dev
```

## Backend Supabase

```bash
supabase login
supabase link --project-ref <votre-projet>
supabase db push                      # applique supabase/migrations/0001_init.sql
supabase functions deploy chariow-create-payment
supabase functions deploy chariow-webhook
supabase secrets set CHARIOW_SECRET_KEY=xxxx CHARIOW_WEBHOOK_SECRET=xxxx
```

## Stack

- **Frontend** : React 18 + Vite + React Router
- **Backend** : Supabase (Postgres + Auth + Row Level Security + Edge Functions)
- **Paiement** : Chariow (clé secrète uniquement côté Edge Function, jamais dans le frontend)
- **i18n** : dictionnaire FR/EN maison (`src/i18n`)
